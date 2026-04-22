import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteLeadCommand } from './delete-lead.command';
import { LeadRepository } from '../../../domain/ports/lead.repository';
import { LeadNotFoundException } from '../../../domain/exceptions/lead.exceptions';
import { UuidValueObject } from '@shared/value-objects/uuid.value-object';

@CommandHandler(DeleteLeadCommand)
export class DeleteLeadHandler implements ICommandHandler<DeleteLeadCommand> {
  constructor(
    @Inject(LeadRepository)
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(command: DeleteLeadCommand): Promise<{ id: string }> {
    const lead = await this.leadRepository.findById(new UuidValueObject(command.id));
    if (!lead) throw new LeadNotFoundException(command.id);

    lead.delete();
    await this.leadRepository.delete(new UuidValueObject(command.id));
    return { id: lead.id.value };
  }
}