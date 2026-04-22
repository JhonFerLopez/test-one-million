import { IQuery } from '@nestjs/cqrs';
import { AiSummaryFilterDto } from '../../dtos/ai-summary-filter.dto';

export class GetAiSummaryQuery implements IQuery {
  constructor(public readonly filter: AiSummaryFilterDto) {}
}
