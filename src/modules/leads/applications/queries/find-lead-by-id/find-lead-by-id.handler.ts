import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { FindLeadByIdQuery } from './find-lead-by-id.query';
import { LeadRepository } from '../../../domain/ports/lead.repository';
import { LeadNotFoundException } from '../../../domain/exceptions/lead.exceptions';
import { UuidValueObject } from '@shared/value-objects/uuid.value-object';
import { LeadResponseDto } from '../../dtos/lead-response.dto';

@QueryHandler(FindLeadByIdQuery)
export class FindLeadByIdHandler implements IQueryHandler<FindLeadByIdQuery, LeadResponseDto> {
  constructor(
    @Inject(LeadRepository)
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(query: FindLeadByIdQuery): Promise<LeadResponseDto> {
    const lead = await this.leadRepository.findById(new UuidValueObject(query.id));
    if (!lead) throw new LeadNotFoundException(query.id);
    return LeadResponseDto.fromEntity(lead);
  }
}
