import { DomainEvent } from '../../../../shared/domain/domain-event';

export class LeadCreateEvent extends DomainEvent {
  public static readonly EVENT_NAME:string = 'user.created';

  constructor(
    public readonly id: string
  ) {
    super(LeadCreateEvent.EVENT_NAME);
  }
}