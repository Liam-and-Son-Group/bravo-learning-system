/**
 * Lexical Editor Core
 * Base editor component with plugin architecture
 */

import { useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import type { EditorState, SerializedEditorState } from "lexical";
import type { EditorPlugin } from "../types";

interface LexicalEditorCoreProps {
  /** Plugins to load */
  plugins?: EditorPlugin[];
  /** Initial content */
  initialContent?: string;
  /** Content change callback */
  onChange?: (content: SerializedEditorState) => void;
  /** Whether editor is editable */
  editable?: boolean;
  /** Custom placeholder */
  placeholder?: string;
  /** Custom theme */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: Record<string, any>;
}

/**
 * Default Lexical theme
 */
const defaultTheme = {
  paragraph: "mb-2",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

/**
 * Core Lexical Editor Component
 */
export function LexicalEditorCore({
  plugins = [],
  onChange,
  editable = true,
  placeholder = "Start typing...",
  theme = defaultTheme,
}: LexicalEditorCoreProps) {
  const initialConfig = useMemo(
    () => ({
      namespace: "BravoEditor",
      theme,
      onError: (error: Error) => {
        console.error("Lexical Error:", error);
      },
      editable,
      nodes: [], // Will be populated by plugins
    }),
    [theme, editable]
  );

  const handleChange = (editorState: EditorState) => {
    if (onChange) {
      editorState.read(() => {
        const json = editorState.toJSON();
        onChange(json);
      });
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative border rounded-lg bg-white">
        {/* Rich text editing area */}
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[200px] p-4 outline-none" />
          }
          placeholder={
            <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        {/* Core plugins */}
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />

        {/* Render loaded plugins */}
        {plugins.map((plugin) => (
          <PluginRenderer key={plugin.id} plugin={plugin} />
        ))}
      </div>
    </LexicalComposer>
  );
}

/**
 * Plugin renderer - handles plugin initialization
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PluginRenderer({ plugin: _plugin }: { plugin: EditorPlugin }) {
  // Plugin initialization happens here
  // Each plugin can add custom Lexical nodes/commands/etc
  return null;
}
