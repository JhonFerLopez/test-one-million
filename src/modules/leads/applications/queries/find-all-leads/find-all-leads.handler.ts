import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { FindAllLeadsQuery } from './find-all-leads.query';
import { LeadRepository } from '../../../domain/ports/lead.repository';
import { LeadStatus } from '../../../domain/entities/lead.entity';
import { LeadResponseDto } from '../../dtos/lead-response.dto';

@QueryHandler(FindAllLeadsQuery)
export class FindAllLeadsHandler implements IQueryHandler<FindAllLeadsQuery, LeadResponseDto[]> {
  constructor(
    @Inject(LeadRepository)
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(): Promise<LeadResponseDto[]> {
    const leads = await this.leadRepository.findAll({
      where: { status: LeadStatus.ACTIVE },
    });
    return leads.map(LeadResponseDto.fromEntity);
  }
}
