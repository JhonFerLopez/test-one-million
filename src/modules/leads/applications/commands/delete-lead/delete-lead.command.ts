import { ICommand } from '@nestjs/cqrs';

export class DeleteLeadCommand implements ICommand {
  constructor(public readonly id: string) {}
}