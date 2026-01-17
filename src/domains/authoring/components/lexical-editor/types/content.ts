/**
 * Content Block Types
 */

import type { MatchingData } from "./matching";
import type { FillInBlankData } from "./fill-in-blank";
import type { MultipleChoiceData } from "./multiple-choice";
import type { DragDropData } from "./drag-drop";

/**
 * Content block - represents a node in the editor
 */
export interface ContentBlock {
  id: string;
  pluginId: string;
  data:
    | MatchingData
    | FillInBlankData
    | MultipleChoiceData
    | DragDropData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | any;
  createdAt: number;
  updatedAt: number;
}

/**
 * Editor state
 */
export interface EditorState {
  blocks: ContentBlock[];
}
