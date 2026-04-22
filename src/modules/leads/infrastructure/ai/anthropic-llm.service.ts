import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { LlmPort } from '../../domain/ports/llm.port';

@Injectable()
export class AnthropicLlmService implements LlmPort {
  private readonly logger = new Logger(AnthropicLlmService.name);
  private readonly client: Anthropic | null;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
      this.logger.log('Anthropic LLM activo');
    } else {
      this.client = null;
      this.logger.warn('ANTHROPIC_API_KEY no configurada — usando respuesta mock');
    }
  }

  async generateSummary(prompt: string): Promise<string> {
    if (!this.client) {
      return this.mockSummary();
    }

    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = response.content[0];
    return block.type === 'text' ? block.text : 'No se pudo generar el resumen.';
  }

  // Respuesta simulada cuando no hay API key configurada.
  // Estructura idéntica a lo que devolvería el LLM real para facilitar pruebas.
  private mockSummary(): string {
    return [
      '[MOCK — agrega ANTHROPIC_API_KEY en .env para activar IA real]',
      '',
      '1. Análisis general:',
      'La cartera de leads muestra una distribución equilibrada entre múltiples canales de adquisición.',
      'El presupuesto promedio indica un segmento con capacidad de inversión media-alta, lo que',
      'representa una oportunidad de negocio sólida para el equipo comercial.',
      '',
      '2. Fuente principal:',
      'El canal "website" concentra el mayor volumen de leads, lo que confirma que las estrategias',
      'de marketing digital están generando tracción. Sin embargo, el canal "referral" presenta',
      'leads de mayor calidad por su carácter orgánico.',
      '',
      '3. Recomendaciones:',
      '- Priorizar seguimiento a leads con presupuesto superior al promedio en las próximas 48 horas.',
      '- Diseñar una campaña específica para reactivar el canal "cold_call" con menor volumen.',
      '- Segmentar por producto de interés para personalizar la propuesta comercial y aumentar',
      '  la tasa de conversión.',
    ].join('\n');
  }
}
