/**
 * Multiple Choice Plugin Types
 */

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceData {
  type?: "multiple-choice";
  title?: string;
  question?: string;
  instructions?: string;
  options: MultipleChoiceOption[];
  allowMultiple?: boolean;
  shuffle?: boolean;
}
