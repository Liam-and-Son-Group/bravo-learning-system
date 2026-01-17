/**
 * Mini Rich Text Editor Component
 * A compact rich text editor for use in option fields (Matching, Multiple Choice, Drag & Drop)
 * Supports text formatting, images, videos, and audio
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, type EditorState, type LexicalEditor } from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { miniEditorConfig } from "./config";
import { ToolbarPlugin } from "./ToolbarPlugin";
import { MediaInsertDialogs } from "./MediaInsertDialogs";
import { $createImageNode } from "./nodes/ImageNode";
import { $createVideoNode } from "./nodes/VideoNode";
import { $createAudioNode } from "./nodes/AudioNode";
import type { MiniRichEditorProps } from "./types";

function MediaInsertPlugin({
  onReady,
}: {
  onReady: (plugin: {
    insertImage: (url: string) => void;
    insertVideo: (url: string) => void;
    insertAudio: (url: string) => void;
  }) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const insertImage = (url: string) => {
      editor.update(() => {
        const root = $getRoot();
        const imageNode = $createImageNode({ src: url, alt: "Uploaded image" });
        root.append(imageNode);
      });
    };

    const insertVideo = (url: string) => {
      editor.update(() => {
        const root = $getRoot();
        const videoNode = $createVideoNode({ src: url });
        root.append(videoNode);
      });
    };

    const insertAudio = (url: string) => {
      editor.update(() => {
        const root = $getRoot();
        const audioNode = $createAudioNode({ src: url });
        root.append(audioNode);
      });
    };

    onReady({ insertImage, insertVideo, insertAudio });
  }, [editor, onReady]);

  return null;
}

function InitialContentPlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!value || isInitializedRef.current) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      const parser = new DOMParser();
      const dom = parser.parseFromString(value, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom.body);

      root.append(...nodes);
    });

    isInitializedRef.current = true;
  }, [editor, value]);

  return null;
}

export function MiniRichEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  disabled = false,
  className = "",
}: MiniRichEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showAudioDialog, setShowAudioDialog] = useState(false);
  const mediaPluginRef = useRef<{
    insertImage: (url: string) => void;
    insertVideo: (url: string) => void;
    insertAudio: (url: string) => void;
  } | null>(null);

  // Debounce onChange to avoid generating HTML on every keystroke
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleEditorChange = useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        editorState.read(() => {
          const htmlString = $generateHtmlFromNodes(editor, null);
          onChange(htmlString);
        });
      }, 300); // 300ms debounce
    },
    [onChange]
  );

  const handleCloseDialogs = useCallback(() => {
    setShowImageDialog(false);
    setShowVideoDialog(false);
    setShowAudioDialog(false);
  }, []);

  const onImageInsert = useCallback((url: string) => {
    if (mediaPluginRef.current) {
      mediaPluginRef.current.insertImage(url);
    }
  }, []);

  const onVideoInsert = useCallback((url: string) => {
    if (mediaPluginRef.current) {
      mediaPluginRef.current.insertVideo(url);
    }
  }, []);

  const onAudioInsert = useCallback((url: string) => {
    if (mediaPluginRef.current) {
      mediaPluginRef.current.insertAudio(url);
    }
  }, []);

  const handleMediaPluginReady = useCallback(
    (plugin: {
      insertImage: (url: string) => void;
      insertVideo: (url: string) => void;
      insertAudio: (url: string) => void;
    }) => {
      mediaPluginRef.current = plugin;
    },
    []
  );

  // Memoize config to prevent recreation
  const editorConfig = useMemo(() => miniEditorConfig, []);

  return (
    <div
      className={`border rounded-md ${className} ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin
          onInsertImage={() => setShowImageDialog(true)}
          onInsertVideo={() => setShowVideoDialog(true)}
          onInsertAudio={() => setShowAudioDialog(true)}
        />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[60px] max-h-[200px] overflow-auto px-3 py-2 focus:outline-none" />
            }
            placeholder={
              <div className="absolute top-2 left-3 text-gray-400 pointer-events-none select-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <OnChangePlugin onChange={handleEditorChange} />
        <MediaInsertPlugin onReady={handleMediaPluginReady} />
        <InitialContentPlugin value={value || ""} />
      </LexicalComposer>

      <MediaInsertDialogs
        showImageDialog={showImageDialog}
        showVideoDialog={showVideoDialog}
        showAudioDialog={showAudioDialog}
        onClose={handleCloseDialogs}
        onImageInsert={onImageInsert}
        onVideoInsert={onVideoInsert}
        onAudioInsert={onAudioInsert}
      />
    </div>
  );
}
