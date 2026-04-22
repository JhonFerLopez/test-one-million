import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadTypeOrmEntity } from './infrastructure/persistence/typeorm/lead.typeorm-entity';
import { LeadTypeOrmRepository } from './infrastructure/persistence/typeorm/lead.typeorm-repo';
import { LeadRepository } from './domain/ports/lead.repository';
import { LeadsController } from './infrastructure/http/leads.controller';
import { CreateLeadHandler } from './applications/commands/create-lead/create-lead.handler';
import { UpdateLeadHandler } from './applications/commands/update-lead/update-lead.handler';
import { DeleteLeadHandler } from './applications/commands/delete-lead/delete-lead.handler';
import { FindAllLeadsHandler } from './applications/queries/find-all-leads/find-all-leads.handler';
import { FindLeadByIdHandler } from './applications/queries/find-lead-by-id/find-lead-by-id.handler';
import { GetLeadStatsHandler } from './applications/queries/get-lead-stats/get-lead-stats.handler';
import { GetAiSummaryHandler } from './applications/queries/get-ai-summary/get-ai-summary.handler';
import { LeadCreatedHandler } from './applications/events/lead-created/lead-created.handler';
import { AnthropicLlmService } from './infrastructure/ai/anthropic-llm.service';
import { LlmPort } from './domain/ports/llm.port';

const CommandHandlers = [CreateLeadHandler, UpdateLeadHandler, DeleteLeadHandler];
const QueryHandlers = [FindAllLeadsHandler, FindLeadByIdHandler, GetLeadStatsHandler, GetAiSummaryHandler];
const EventHandlers = [LeadCreatedHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([LeadTypeOrmEntity])],
  controllers: [LeadsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    { provide: LeadRepository, useClass: LeadTypeOrmRepository },
    { provide: LlmPort, useClass: AnthropicLlmService },
  ],
})
export class LeadsModule {}
