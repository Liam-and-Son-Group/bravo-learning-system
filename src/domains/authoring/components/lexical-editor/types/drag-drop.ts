/**
 * Drag and Drop Plugin Types
 */

export interface DragDropCategory {
  id: string;
  name: string;
}

export interface DragDropItem {
  id: string;
  text: string;
  categoryId: string;
}

export interface DragDropData {
  type?: "drag-drop";
  title?: string;
  instructions?: string;
  categories: DragDropCategory[];
  items: DragDropItem[];
  shuffle?: boolean;
}
