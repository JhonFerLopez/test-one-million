import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAiSummaryQuery } from './get-ai-summary.query';
import { LeadRepository } from '../../../domain/ports/lead.repository';
import { LlmPort } from '../../../domain/ports/llm.port';
import { Lead, LeadStatus } from '../../../domain/entities/lead.entity';
import { AiSummaryFilterDto } from '../../dtos/ai-summary-filter.dto';

@QueryHandler(GetAiSummaryQuery)
export class GetAiSummaryHandler implements IQueryHandler<GetAiSummaryQuery, string> {
  constructor(
    @Inject(LeadRepository)
    private readonly leadRepository: LeadRepository,
    @Inject(LlmPort)
    private readonly llm: LlmPort,
  ) {}

  async execute(query: GetAiSummaryQuery): Promise<string> {
    let leads = await this.leadRepository.findAll({
      where: { status: LeadStatus.ACTIVE },
    });

    leads = this.applyFilters(leads, query.filter);

    const prompt = this.buildPrompt(leads, query.filter);
    return this.llm.generateSummary(prompt);
  }

  private applyFilters(leads: Lead[], filter: AiSummaryFilterDto): Lead[] {
    if (filter.source) {
      leads = leads.filter((l) => l.source === filter.source);
    }
    if (filter.fromDate) {
      const from = new Date(filter.fromDate);
      leads = leads.filter((l) => l.createdAt >= from);
    }
    if (filter.toDate) {
      const to = new Date(filter.toDate);
      leads = leads.filter((l) => l.createdAt <= to);
    }
    return leads;
  }

  private buildPrompt(leads: Lead[], filter: AiSummaryFilterDto): string {
    const total = leads.length;
    const avgBudget =
      total > 0 ? leads.reduce((s, l) => s + l.budget, 0) / total : 0;

    const bySource = leads.reduce<Record<string, number>>((acc, l) => {
      acc[l.source] = (acc[l.source] ?? 0) + 1;
      return acc;
    }, {});

    const filterDesc =
      [
        filter.source ? `fuente: ${filter.source}` : null,
        filter.fromDate ? `desde: ${filter.fromDate}` : null,
        filter.toDate ? `hasta: ${filter.toDate}` : null,
      ]
        .filter(Boolean)
        .join(', ') || 'sin filtros';

    const leadsList = leads
      .map(
        (l) =>
          `- ${l.name.name} | fuente: ${l.source} | presupuesto: $${l.budget} | interés: ${l.productInterest}`,
      )
      .join('\n');

    return `Eres un analista de ventas senior. Genera un resumen ejecutivo en español sobre los siguientes leads comerciales.

Filtros aplicados: ${filterDesc}
Total de leads: ${total}
Presupuesto promedio: $${avgBudget.toFixed(2)}
Distribución por fuente: ${JSON.stringify(bySource, null, 2)}

Leads:
${leadsList || 'No hay leads que coincidan con los filtros.'}

Incluye en tu respuesta:
1. Análisis general del estado de los leads
2. Fuente principal y su relevancia
3. Tres recomendaciones concretas para el equipo de ventas

Responde en texto plano, sin markdown ni asteriscos.`;
  }
}
