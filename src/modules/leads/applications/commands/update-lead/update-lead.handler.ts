import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateLeadCommand } from './update-lead.command';
import { LeadRepository } from '../../../domain/ports/lead.repository';
import { LeadNotFoundException } from '../../../domain/exceptions/lead.exceptions';
import { UuidValueObject } from '@shared/value-objects/uuid.value-object';
import { Name } from '../../../domain/value-objects/name.value-object';
import { Email } from '../../../domain/value-objects/email.value-object';

@CommandHandler(UpdateLeadCommand)
export class UpdateLeadHandler implements ICommandHandler<UpdateLeadCommand> {
  constructor(
    @Inject(LeadRepository)
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(command: UpdateLeadCommand): Promise<{ id: string }> {
    const { name, email, phone = '', source, productInterest = '', budget = 0 } = command.dto;
    const lead = await this.leadRepository.findById(new UuidValueObject(command.id));
    if (!lead) throw new LeadNotFoundException(command.id);

    lead.updatePath({
      name: name !== undefined ? Name.create(name) : lead.name,
      email: email !== undefined ? Email.create(email) : lead.email,
      phone: phone !== undefined ? phone : '',
      source: source !== undefined ? source : lead.source,
      productInterest: productInterest !== undefined ? productInterest : '',
      budget: budget !== undefined ? command.dto.budget : lead.budget,
    });

    const updatedLead = await this.leadRepository.update(lead);

    return { id: updatedLead.id.value };
  }
}
