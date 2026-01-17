/**
 * Toolbar Plugin for Mini Rich Text Editor
 * Provides text formatting controls and media insertion buttons
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, type TextFormatType } from "lexical";
import {
  Bold,
  Italic,
  Underline,
  Image as ImageIcon,
  Video,
  Music,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { ToolbarPluginProps } from "./types";

export function ToolbarPlugin({
  onInsertImage,
  onInsertVideo,
  onInsertAudio,
}: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="flex items-center gap-1 p-1 border-b bg-gray-50 rounded-t-md">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatText("bold")}
        className="h-7 w-7 p-0"
        title="Bold"
        type="button"
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatText("italic")}
        className="h-7 w-7 p-0"
        title="Italic"
        type="button"
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatText("underline")}
        className="h-7 w-7 p-0"
        title="Underline"
        type="button"
      >
        <Underline className="h-3.5 w-3.5" />
      </Button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={onInsertImage}
        className="h-7 w-7 p-0"
        title="Insert Image"
        type="button"
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onInsertVideo}
        className="h-7 w-7 p-0"
        title="Insert Video"
        type="button"
      >
        <Video className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onInsertAudio}
        className="h-7 w-7 p-0"
        title="Insert Audio"
        type="button"
      >
        <Music className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
