/**
 * Lexical Editor Types
 * Core types for the extensible Lexical-based content editor
 */

import type { LexicalEditor } from "lexical";

/**
 * Base plugin interface - all content modules must implement this
 */
export interface EditorPlugin {
  /** Unique identifier for the plugin */
  id: string;
  /** Display name */
  name: string;
  /** Plugin type/category */
  type: "content" | "toolbar" | "inline";
  /** Icon component for toolbar */
  icon?: React.ComponentType<{ className?: string }>;
  /** Initialize plugin with editor instance */
  initialize: (editor: LexicalEditor) => void;
  /** Cleanup when plugin is removed */
  cleanup?: () => void;
  /** Plugin-specific configuration */
  config?: Record<string, any>;
}

/**
 * Content plugin - creates interactive content blocks
 */
export interface ContentPlugin extends EditorPlugin {
  type: "content";
  /** Render the content editor/configurator */
  renderEditor: (props: ContentEditorProps) => React.ReactNode;
  /** Render the content in preview/student mode */
  renderPreview: (data: any) => React.ReactNode;
  /** Serialize content to JSON */
  serialize: (data: any) => any;
  /** Deserialize JSON to content data */
  deserialize: (json: any) => any;
}

/**
 * Props for content editor components
 */
export interface ContentEditorProps {
  /** Current content data */
  data: any;
  /** Update content data */
  onChange: (data: any) => void;
  /** Whether in edit mode */
  editable: boolean;
}

/**
 * Matching module specific types
 */
export interface MatchingItem {
  id: string;
  left: string;
  right: string;
}

export interface MatchingData {
  type: "matching";
  title?: string;
  instructions?: string;
  items: MatchingItem[];
  shuffle?: boolean;
}

/**
 * Fill in blank module specific types
 */
export interface BlankItem {
  id: string;
  text: string;
  answer: string;
  alternatives?: string[];
}

export interface FillInBlankData {
  type: "fill-in-blank";
  title?: string;
  instructions?: string;
  items: BlankItem[];
  caseSensitive?: boolean;
}

/**
 * Content block - represents a node in the editor
 */
export interface ContentBlock {
  id: string;
  pluginId: string;
  data: MatchingData | FillInBlankData | any;
  createdAt: number;
  updatedAt: number;
}

/**
 * Editor state
 */
export interface EditorState {
  blocks: ContentBlock[];
}
