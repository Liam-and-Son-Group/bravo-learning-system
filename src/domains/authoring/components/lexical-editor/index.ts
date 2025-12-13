/**
 * Lexical Editor Module
 * Main entry point for the content editor system
 */

export { LexicalEditorCore } from "./core/LexicalEditorCore";
export {
  DEFAULT_PLUGINS,
  MatchingPlugin,
  FillInBlankPlugin,
  MultipleChoicePlugin,
  DragDropPlugin,
} from "./plugins";
export type {
  EditorPlugin,
  ContentPlugin,
  MatchingData,
  FillInBlankData,
  ContentBlock,
  EditorState,
} from "./types";
