import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { LeadCreateEvent } from '../../../domain/events/lead-create.event';

@EventsHandler(LeadCreateEvent)
export class LeadCreatedHandler implements IEventHandler<LeadCreateEvent> {
  private readonly logger = new Logger(LeadCreatedHandler.name);

  handle(event: LeadCreateEvent): void {
    this.logger.log(`Lead creado con ID: ${event.id}`);
  }
}
