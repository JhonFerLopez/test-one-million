export class LeadsBySourceDto {
  source!: string;
  count!: number;
}

export class LeadStatsResponseDto {
  totalLeads!: number;
  leadsBySource!: LeadsBySourceDto[];
  averageBudget!: number;
  lastSevenDaysLeads!: number;
}
