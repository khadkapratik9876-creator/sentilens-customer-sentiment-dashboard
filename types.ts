export interface SentimentDataPoint {
  date: string;
  sentiment: number;
}

export interface KeywordData {
  text: string;
  value: number;
  type: 'complaint' | 'praise' | 'neutral';
}

export interface ExecutiveSummary {
  overview: string;
  actionableAreas: string[];
}

export interface AnalysisResult {
  sentimentTrend: SentimentDataPoint[];
  keywords: KeywordData[];
  summary: ExecutiveSummary;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export enum ModelType {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview',
}
