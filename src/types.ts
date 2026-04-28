export enum FlirtLevel {
  LIGHT = 'leve',
  MEDIUM = 'médio',
  BOLD = 'ousado'
}

export interface Suggestion {
  text: string;
  level: FlirtLevel;
  explanation: string;
}

export interface AnalysisResult {
  interestLevel: string;
  tone: string;
  signs: string[];
  suggestions: Suggestion[];
  bestOption: string;
  thingsToAvoid: string[];
}

export interface GeminiResponse {
  analysis: AnalysisResult;
}
