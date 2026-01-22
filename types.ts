
export type Operation = '+' | '-' | '*' | '/' | null;

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface AIExplanation {
  explanation: string;
  funFact?: string;
}
