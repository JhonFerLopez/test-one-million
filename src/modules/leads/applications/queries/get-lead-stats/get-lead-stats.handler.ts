import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetLeadStatsQuery } from './get-lead-stats.query';
import { LeadRepository } from '../../../domain/ports/lead.repository';
import { LeadStatsResponseDto } from '../../dtos/lead-stats-response.dto';

@QueryHandler(GetLeadStatsQuery)
export class GetLeadStatsHandler implements IQueryHandler<GetLeadStatsQuery, LeadStatsResponseDto> {
  constructor(
    @Inject(LeadRepository)
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(): Promise<LeadStatsResponseDto> {
    return this.leadRepository.stats();
  }
}
