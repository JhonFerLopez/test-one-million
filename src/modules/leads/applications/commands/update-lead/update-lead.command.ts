import { ICommand } from '@nestjs/cqrs';
import { UpdateLeadDto } from '../../dtos/update-lead.dto';

export class UpdateLeadCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateLeadDto,
  ) {}
}
