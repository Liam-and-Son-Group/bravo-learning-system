/**
 * Fill in Blank Plugin Types
 */

export interface BlankItem {
  id: string;
  text: string;
  answer: string;
  alternatives?: string[];
}

export interface FillInBlankData {
  type?: "fill-in-blank";
  title?: string;
  instructions?: string;
  items: BlankItem[];
  caseSensitive?: boolean;
}
