/**
 * Plugin Registry
 * Central export for all available editor plugins
 */

export { MatchingPlugin } from "./matching/MatchingPlugin";
export { FillInBlankPlugin } from "./fill-in-blank/FillInBlankPlugin";
export { MultipleChoicePlugin } from "./multiple-choice/MultipleChoicePlugin";
export { DragDropPlugin } from "./drag-drop/DragDropPlugin";
export { CodeBlockPlugin } from "./code-block";
export { PollPlugin } from "./poll";
export { FlashcardPlugin } from "./flashcard";
export { OrderingPlugin } from "./ordering/OrderingPlugin";

// Export all plugins as an array for easy registration
import { MatchingPlugin } from "./matching/MatchingPlugin";
import { FillInBlankPlugin } from "./fill-in-blank/FillInBlankPlugin";
import { MultipleChoicePlugin } from "./multiple-choice/MultipleChoicePlugin";
import { DragDropPlugin } from "./drag-drop/DragDropPlugin";
import { CodeBlockPlugin } from "./code-block";
import { PollPlugin } from "./poll";
import { FlashcardPlugin } from "./flashcard";

export const DEFAULT_PLUGINS = [
  MatchingPlugin,
  FillInBlankPlugin,
  MultipleChoicePlugin,
  MultipleChoicePlugin,
  DragDropPlugin,
  CodeBlockPlugin,
  PollPlugin,
  FlashcardPlugin,
];
