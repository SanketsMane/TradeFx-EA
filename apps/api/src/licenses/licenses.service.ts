import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BotLicense, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../common/audit/audit.service';
import { Actor } from '../common/scope';
import { productName } from '../common/catalog';
import { generateLicenseCode } from '../common/license-code';
import { IssueLicenseDto } from './dto/issue-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';

const LIST_VIEW = {
  id: true,
  code: true,
  productSlug: true,
  productName: true,
  status: true,
  issuedAt: true,
  activatedAt: true,
  expiresAt: true,
  user: { select: { id: true, email: true, fullName: true } },
  linkedAccount: { select: { id: true, label: true, login: true, platform: true } },
} satisfies Prisma.BotLicenseSelect;

@Injectable()
export class LicensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly mail: MailService,
  ) {}

  /** Issues a new licence code to a customer. Staff-only. */
  async issue(dto: IssueLicenseDto, actor: Actor) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { id: true, role: true, email: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.CUSTOMER) {
      throw new BadRequestException('Licences can only be issued to customer accounts.');
    }

    const license = await this.withUniqueCode((code) =>
      this.prisma.botLicense.create({
        data: {
          code,
          userId: dto.userId,
          productSlug: dto.productSlug,
          productName: productName(dto.productSlug),
          issuedById: actor.sub,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        },
        select: LIST_VIEW,
      }),
    );

    // The code is the product — deliver it immediately, best-effort.
    void this.mail.sendLicenseIssued(user.email, {
      productName: license.productName,
      code: license.code,
      expiresAt: license.expiresAt,
    });

    await this.audit.log({
      userId: actor.sub,
      action: 'LICENSE_ISSUED',
      entityType: 'BotLicense',
      entityId: license.id,
      meta: { userId: dto.userId, productSlug: dto.productSlug },
    });

    return license;
  }

  findAll(userId?: string) {
    return this.prisma.botLicense.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { issuedAt: 'desc' },
      select: LIST_VIEW,
    });
  }

  async update(id: string, dto: UpdateLicenseDto, actor: Actor): Promise<BotLicense> {
    const existing = await this.prisma.botLicense.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Licence not found');

    const updated = await this.prisma.botLicense.update({
      where: { id },
      data: {
        status: dto.status ?? existing.status,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : existing.expiresAt,
      },
    });

    await this.audit.log({
      userId: actor.sub,
      action: 'LICENSE_UPDATED',
      entityType: 'BotLicense',
      entityId: id,
      meta: { status: updated.status },
    });

    return updated;
  }

  /**
   * Codes are random, so a collision is vanishingly rare — but the column is
   * unique, and retrying is cheaper than letting a 500 reach an admin.
   */
  private async withUniqueCode<T>(create: (code: string) => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        return await create(generateLicenseCode());
      } catch (err) {
        const isDuplicate =
          err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
        if (!isDuplicate) throw err;
      }
    }
    throw new BadRequestException('Could not allocate a licence code. Please try again.');
  }
}
