export abstract class DomainEvent {
  public readonly eventName: string;

  constructor(eventName: string) {
    this.eventName = eventName;
  }
}