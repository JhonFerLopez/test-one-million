import { ICommand } from '@nestjs/cqrs';
import { CreateLeadDto } from '../../dtos/create-lead.dto';

export class CreateLeadCommand implements ICommand {
  constructor(public readonly dto: CreateLeadDto) {}
}
