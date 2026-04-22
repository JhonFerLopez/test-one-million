import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateLeadCommand } from './create-lead.command';

// Import Domain
import { LeadRepository } from '../../../domain/ports/lead.repository';
import { Lead } from '../../../domain/entities/lead.entity';
import { Email } from '../../../domain/value-objects/email.value-object'
import { LeadAlreadyExistsException } from '../../../domain/exceptions/lead.exceptions';

@CommandHandler(CreateLeadCommand)
export class CreateLeadHandler implements ICommandHandler<CreateLeadCommand> {
  constructor(
    @Inject(LeadRepository)
    private readonly leadRepository: LeadRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateLeadCommand): Promise<{ id: string }> {
    const { name, email, phone = '', source, productInterest = '', budget = 0 } = command.dto;

    const leadEmailValidate = Email.create(email);
    const exists = await this.leadRepository.findByEmail(leadEmailValidate);
    if (exists) throw new LeadAlreadyExistsException(email);

    const lead = Lead.create(
      { name, email, phone, source, productInterest, budget },
    );
    const savedLead = await this.leadRepository.save(lead);

    const events = lead.pullDomainEvents();
    events.forEach((event) => this.eventBus.publish(event));

    return { id: savedLead.id.value };
  }
}
