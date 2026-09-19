import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { Actor } from '../common/scope';
import { CreateBrokerDto, UpdateBrokerDto } from './dto/broker.dto';

@Injectable()
export class BrokersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** Staff view — includes unpublished rows. */
  findAll() {
    return this.prisma.brokerOffer.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async create(dto: CreateBrokerDto, actor: Actor) {
    const broker = await this.prisma.brokerOffer.create({
      data: {
        name: dto.name.trim(),
        blurb: dto.blurb.trim(),
        signupUrl: dto.signupUrl.trim(),
        logo: dto.logo?.trim() || null,
        highlights: dto.highlights ?? [],
        sortOrder: dto.sortOrder ?? 0,
        published: dto.published ?? true,
      },
    });
    await this.audit.log({
      userId: actor.sub,
      action: 'BROKER_CREATED',
      entityType: 'BrokerOffer',
      entityId: broker.id,
      meta: { name: broker.name },
    });
    return broker;
  }

  async update(id: string, dto: UpdateBrokerDto, actor: Actor) {
    const existing = await this.prisma.brokerOffer.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Broker not found');

    const broker = await this.prisma.brokerOffer.update({
      where: { id },
      data: {
        name: dto.name?.trim() ?? existing.name,
        blurb: dto.blurb?.trim() ?? existing.blurb,
        signupUrl: dto.signupUrl?.trim() ?? existing.signupUrl,
        logo: dto.logo !== undefined ? dto.logo.trim() || null : existing.logo,
        highlights: dto.highlights ?? existing.highlights,
        sortOrder: dto.sortOrder ?? existing.sortOrder,
        published: dto.published ?? existing.published,
      },
    });
    await this.audit.log({
      userId: actor.sub,
      action: 'BROKER_UPDATED',
      entityType: 'BrokerOffer',
      entityId: id,
      meta: { name: broker.name, published: broker.published },
    });
    return broker;
  }

  async remove(id: string, actor: Actor): Promise<void> {
    const existing = await this.prisma.brokerOffer.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Broker not found');
    await this.prisma.brokerOffer.delete({ where: { id } });
    await this.audit.log({
      userId: actor.sub,
      action: 'BROKER_DELETED',
      entityType: 'BrokerOffer',
      entityId: id,
      meta: { name: existing.name },
    });
  }
}
