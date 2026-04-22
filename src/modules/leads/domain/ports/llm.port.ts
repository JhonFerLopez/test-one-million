export interface LlmPort {
  generateSummary(prompt: string): Promise<string>;
}

export const LlmPort = Symbol('LlmPort');
