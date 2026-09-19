import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, QuoteRequest, QuoteStatus } from '@prisma/client';
import { randomInt } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { MailService } from '../mail/mail.service';
import { PRODUCTS, isProductSlug } from '../common/catalog';
import { Actor } from '../common/scope';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

/** Fields a customer is allowed to see on their own request. */
const CUSTOMER_VIEW = {
  id: true,
  reference: true,
  productSlug: true,
  serviceSlug: true,
  broker: true,
  accountSize: true,
  message: true,
  status: true,
  quotedNote: true,
  quotedAt: true,
  createdAt: true,
} satisfies Prisma.QuoteRequestSelect;

@Injectable()
export class QuotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly mail: MailService,
  ) {}

  /**
   * Public submission. Anonymous visitors can file a request, so there is no
   * actor — we match the address to an existing account instead, which is what
   * makes the request show up under "My Quotations" when they sign in.
   */
  async submit(dto: CreateQuoteDto): Promise<{ reference: string }> {
    if (!dto.productSlug && !dto.serviceSlug) {
      throw new BadRequestException('Tell us which Expert Advisor or service to quote for.');
    }
    if (dto.productSlug && dto.serviceSlug) {
      throw new BadRequestException('Choose either an Expert Advisor or a service, not both.');
    }

    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });

    const created = await this.withUniqueReference((reference) =>
      this.prisma.quoteRequest.create({
        data: {
          reference,
          userId: user?.id ?? null,
          name: dto.name.trim(),
          email,
          phone: dto.phone?.trim() || null,
          productSlug: dto.productSlug ?? null,
          serviceSlug: dto.serviceSlug ?? null,
          broker: dto.broker?.trim() || null,
          accountSize: dto.accountSize ?? null,
          message: dto.message.trim(),
        },
        select: { id: true, reference: true },
      }),
    );

    void this.mail.sendQuoteReceived(email, {
      name: dto.name.trim(),
      reference: created.reference,
      subjectLine: QuotesService.subjectLine(dto.productSlug, dto.serviceSlug),
    });

    await this.audit.log({
      userId: user?.id,
      action: 'QUOTE_REQUESTED',
      entityType: 'QuoteRequest',
      entityId: created.id,
      meta: { reference: created.reference, productSlug: dto.productSlug, serviceSlug: dto.serviceSlug },
    });

    return { reference: created.reference };
  }

  /** The signed-in customer's own requests. */
  findMine(actor: Actor) {
    return this.prisma.quoteRequest.findMany({
      where: { userId: actor.sub },
      orderBy: { createdAt: 'desc' },
      select: CUSTOMER_VIEW,
    });
  }

  /** Staff inbox. Returns everything, newest first. */
  findAll(status?: QuoteStatus) {
    return this.prisma.quoteRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateQuoteDto, actor: Actor): Promise<QuoteRequest> {
    const existing = await this.prisma.quoteRequest.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Quote request not found');

    // Recording a reply is what stamps who answered and when.
    const answering = dto.quotedNote !== undefined || dto.status === QuoteStatus.QUOTED;

    const updated = await this.prisma.quoteRequest.update({
      where: { id },
      data: {
        status: dto.status ?? existing.status,
        quotedNote: dto.quotedNote ?? existing.quotedNote,
        ...(answering ? { quotedAt: new Date(), quotedById: actor.sub } : {}),
      },
    });

    // Only mail the customer when an advisor actually wrote a reply —
    // a bare status change is internal bookkeeping, not news for them.
    if (answering && updated.quotedNote) {
      void this.mail.sendQuoteAnswered(updated.email, {
        name: updated.name,
        reference: updated.reference,
        subjectLine: QuotesService.subjectLine(updated.productSlug, updated.serviceSlug),
        note: updated.quotedNote,
      });
    }

    await this.audit.log({
      userId: actor.sub,
      action: 'QUOTE_UPDATED',
      entityType: 'QuoteRequest',
      entityId: id,
      meta: { status: updated.status, reference: updated.reference },
    });

    return updated;
  }

  /** Human description of what a request was about, for email subjects. */
  private static subjectLine(
    productSlug?: string | null,
    serviceSlug?: string | null,
  ): string {
    if (productSlug && isProductSlug(productSlug)) return PRODUCTS[productSlug];
    if (serviceSlug) {
      return serviceSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return 'General enquiry';
  }

  /**
   * References are short enough to read over the phone, so collisions are
   * possible. Retry a handful of times rather than widening the format.
   */
  private async withUniqueReference<T>(create: (reference: string) => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt < 6; attempt++) {
      const reference = `TFX-${randomInt(1000, 10000)}`;
      try {
        return await create(reference);
      } catch (err) {
        const isDuplicate =
          err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
        if (!isDuplicate) throw err;
      }
    }
    // Astronomically unlikely; better a clear error than a silent overwrite.
    throw new BadRequestException('Could not allocate a reference. Please try again.');
  }
}
