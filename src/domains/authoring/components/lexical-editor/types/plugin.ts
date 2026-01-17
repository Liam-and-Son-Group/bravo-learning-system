/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Base Plugin Types
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
  renderPreview: (options: { data: any; blockId?: string }) => React.ReactNode;
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
  /** Optional actions to render in the card header */
  actions?: React.ReactNode;
  /** Optional remove callback */
  onRemove?: () => void;
}
