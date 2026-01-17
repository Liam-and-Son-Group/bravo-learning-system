/**
 * Type definitions for Mini Rich Text Editor
 */

export interface MiniRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export interface ToolbarPluginProps {
  onInsertImage: () => void;
  onInsertVideo: () => void;
  onInsertAudio: () => void;
}

export interface MediaInsertDialogsProps {
  showImageDialog: boolean;
  showVideoDialog: boolean;
  showAudioDialog: boolean;
  onClose: () => void;
  onImageInsert: (url: string) => void;
  onVideoInsert: (url: string) => void;
  onAudioInsert: (url: string) => void;
}
