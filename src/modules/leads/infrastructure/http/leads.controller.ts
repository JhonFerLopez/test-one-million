import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateLeadCommand } from '../../applications/commands/create-lead/create-lead.command';
import { UpdateLeadCommand } from '../../applications/commands/update-lead/update-lead.command';
import { DeleteLeadCommand } from '../../applications/commands/delete-lead/delete-lead.command';
import { FindAllLeadsQuery } from '../../applications/queries/find-all-leads/find-all-leads.query';
import { FindLeadByIdQuery } from '../../applications/queries/find-lead-by-id/find-lead-by-id.query';
import { GetLeadStatsQuery } from '../../applications/queries/get-lead-stats/get-lead-stats.query';
import { GetAiSummaryQuery } from '../../applications/queries/get-ai-summary/get-ai-summary.query';
import { CreateLeadDto } from '../../applications/dtos/create-lead.dto';
import { UpdateLeadDto } from '../../applications/dtos/update-lead.dto';
import { LeadResponseDto } from '../../applications/dtos/lead-response.dto';
import { LeadStatsResponseDto } from '../../applications/dtos/lead-stats-response.dto';
import { AiSummaryFilterDto } from '../../applications/dtos/ai-summary-filter.dto';

@Controller('leads')
export class LeadsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateLeadDto): Promise<{ id: string }> {
    return this.commandBus.execute(new CreateLeadCommand(dto));
  }

  @Get('stats')
  getStats(): Promise<LeadStatsResponseDto> {
    return this.queryBus.execute(new GetLeadStatsQuery());
  }

  @Get()
  findAll(): Promise<LeadResponseDto[]> {
    return this.queryBus.execute(new FindAllLeadsQuery());
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<LeadResponseDto> {
    return this.queryBus.execute(new FindLeadByIdQuery(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto): Promise<void> {
    return this.commandBus.execute(new UpdateLeadCommand(id, dto));
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteLeadCommand(id));
  }

  @Post('ai/summary')
  aiSummary(@Body() filter: AiSummaryFilterDto): Promise<string> {
    return this.queryBus.execute(new GetAiSummaryQuery(filter));
  }

}
