import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateLeadHandler } from './applications/commands/create-lead/create-lead.handler';
import { UpdateLeadHandler } from './applications/commands/update-lead/update-lead.handler';
import { FindAllLeadsHandler } from './applications/queries/find-all-leads/find-all-leads.handler';
import { FindLeadByIdHandler } from './applications/queries/find-lead-by-id/find-lead-by-id.handler';
import { GetLeadStatsHandler } from './applications/queries/get-lead-stats/get-lead-stats.handler';
import { LeadCreatedHandler } from './applications/events/lead-created/lead-created.handler';

const CommandHandlers = [CreateLeadHandler, UpdateLeadHandler];
const QueryHandlers = [FindAllLeadsHandler, FindLeadByIdHandler, GetLeadStatsHandler];
const EventHandlers = [LeadCreatedHandler];

@Module({
  imports: [CqrsModule],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers],
  exports: [CqrsModule],
})
export class LeadsModule {}
