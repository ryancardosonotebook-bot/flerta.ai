export enum AnalysisMode {
  NORMAL = 'normal',
  PICKUP = 'pickup',
  RESCUE = 'rescue',
  NAMES = 'names',
  SIMULATOR = 'simulator'
}

export type Relationship = 'amigos' | 'namorados' | 'casados' | 'ex' | 'você gosta dela' | 'ela gosta de você' | 'vocês dois se gostam' | 'desconhecidos';

export enum FlirtLevel {
  LIGHT = 'leve',
  MEDIUM = 'médio',
  BOLD = 'ousado'
}

export interface Suggestion {
  text: string;
  level: FlirtLevel;
  explanation: string;
  simulatedResponse?: string;
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
