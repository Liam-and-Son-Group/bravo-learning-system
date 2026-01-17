import type { LucideIcon } from "lucide-react";
import type { ContentBlock } from "../components/lexical-editor";
import type { ReactNode } from "react";

export type PluginType =
  | "matching"
  | "fill-in-blank"
  | "multiple-choice"
  | "drag-drop"
  | "code-block"
  | "poll"
  | "flashcard"
  | "ordering";

export type TabType = "edit" | "preview" | "live";

// Plugin data types
export interface MatchingData {
  question?: string;
  pairs?: Array<{ left: string; right: string }>;
}

export interface FillInBlankData {
  question?: string;
  text?: string;
  answers?: string[];
}

export interface MultipleChoiceData {
  question?: string;
  options?: Array<{ text: string; isCorrect: boolean }>;
}

export interface DragDropData {
  question?: string;
  pairs?: Array<{ draggable: string; dropzone: string }>;
}

export interface CodeBlockData {
  code?: string;
  language?: string;
}

export interface PollData {
  question?: string;
  options?: Array<{ id: string; text: string }>;
}

export interface FlashcardData {
  front?: string;
  back?: string;
}

export interface OrderingData {
  question?: string;
  items?: Array<{ id: string; text: string }>;
}

export type PluginData =
  | MatchingData
  | FillInBlankData
  | MultipleChoiceData
  | DragDropData
  | CodeBlockData
  | PollData
  | FlashcardData
  | OrderingData;

// Plugin renderer props
export interface PluginEditorProps<T = PluginData> {
  data: T;
  onChange: (data: T) => void;
  editable?: boolean;
  actions?: ReactNode;
  onRemove?: () => void;
}

export interface PluginPreviewProps<T = PluginData> {
  data: T;
  blockId: string;
}

// Plugin interface
export interface Plugin<T = PluginData> {
  renderEditor: (props: PluginEditorProps<T>) => ReactNode;
  renderPreview: (props: PluginPreviewProps<T>) => ReactNode;
}

export interface PluginConfig<T = PluginData> {
  id: PluginType;
  name: string;
  icon: LucideIcon;
  plugin: Plugin<T>;
  defaultData: T;
}

export interface ComposePageState {
  activeTab: TabType;
  contentBlocks: ContentBlock[];
}
