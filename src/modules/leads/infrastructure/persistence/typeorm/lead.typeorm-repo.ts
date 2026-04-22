import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { LeadRepository } from '../../../domain/ports/lead.repository';
import { Lead, LeadStatus } from '../../../domain/entities/lead.entity';
import { UuidValueObject } from '@shared/value-objects/uuid.value-object';
import { Email } from '../../../domain/value-objects/email.value-object';
import { LeadTypeOrmEntity } from './lead.typeorm-entity';
import { LeadMapper } from '../lead.mapper';
import { LeadStatsResponseDto } from '../../../applications/dtos/lead-stats-response.dto';

@Injectable()
export class LeadTypeOrmRepository implements LeadRepository {
  constructor(
    @InjectRepository(LeadTypeOrmEntity)
    private readonly repo: Repository<LeadTypeOrmEntity>,
  ) {}

  async findById(id: UuidValueObject): Promise<Lead | null> {
    const entity = await this.repo.findOne({ where: { id: id.value } });
    return entity ? LeadMapper.toDomain(entity) : null;
  }

  async findByEmail(email: Email): Promise<boolean> {
    const count = await this.repo.count({ where: { email: email.value } });
    return count > 0;
  }

  async findAll({ where }: { where: { status: string } }): Promise<Lead[]> {
    const entities = await this.repo.find({ where: { isActive: where.status } });
    return entities.map(LeadMapper.toDomain);
  }

  async save(lead: Lead): Promise<Lead> {
    const entity = LeadMapper.toPersistence(lead);
    const saved = await this.repo.save(entity);
    return LeadMapper.toDomain(saved);
  }

  async update(lead: Lead): Promise<Lead> {
    await this.repo.update(lead.id.value, {
      name: lead.name.name,
      email: lead.email.value,
      phone: lead.phone,
      source: lead.source,
      productInterest: lead.productInterest,
      budget: lead.budget,
      isActive: lead.isActive,
    });
    const updated = await this.repo.findOneOrFail({ where: { id: lead.id.value } });
    return LeadMapper.toDomain(updated);
  }

  async delete(id: UuidValueObject): Promise<void> {
    await this.repo.update(id.value, { isActive: LeadStatus.DELETED });
  }

  async stats(): Promise<LeadStatsResponseDto> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalLeads, leadsBySource, avgResult, lastSevenDaysLeads] = await Promise.all([
      this.repo.count({ where: { isActive: LeadStatus.ACTIVE } }),
      this.repo
        .createQueryBuilder('lead')
        .select('lead.source', 'source')
        .addSelect('COUNT(lead.id)', 'count')
        .where('lead.isActive = :status', { status: LeadStatus.ACTIVE })
        .groupBy('lead.source')
        .getRawMany<{ source: string; count: string }>(),
      this.repo
        .createQueryBuilder('lead')
        .select('AVG(CAST(lead.budget AS DECIMAL))', 'avg')
        .where('lead.isActive = :status', { status: LeadStatus.ACTIVE })
        .getRawOne<{ avg: string }>(),
      this.repo.count({
        where: {
          isActive: LeadStatus.ACTIVE,
          createdAt: MoreThan(sevenDaysAgo),
        },
      }),
    ]);

    return {
      totalLeads,
      leadsBySource: leadsBySource.map((r) => ({
        source: r.source,
        count: parseInt(r.count, 10),
      })),
      averageBudget: parseFloat(avgResult?.avg ?? '0'),
      lastSevenDaysLeads,
    };
  }
}
