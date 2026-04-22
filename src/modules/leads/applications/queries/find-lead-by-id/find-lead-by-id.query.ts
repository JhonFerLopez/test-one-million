import { IQuery } from '@nestjs/cqrs';

export class FindLeadByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
