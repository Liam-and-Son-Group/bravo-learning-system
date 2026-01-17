/**
 * Matching Plugin Types
 */

export interface MatchingItem {
  id: string;
  left: string;
  right: string;
  correctAnswerId?: string; // ID of the right item that correctly matches this left item
}

export interface MatchingData {
  type?: "matching";
  title?: string;
  instructions?: string;
  items: MatchingItem[];
  shuffle?: boolean;
  shuffleLeft?: boolean;
  shuffleRight?: boolean;
}
