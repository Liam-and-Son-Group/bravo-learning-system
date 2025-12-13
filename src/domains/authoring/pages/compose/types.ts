import type { LucideIcon } from "lucide-react";
import type { ContentBlock } from "../../components/lexical-editor";

export type PluginType =
  | "matching"
  | "fill-in-blank"
  | "multiple-choice"
  | "drag-drop";

export type TabType = "edit" | "preview";

export interface PluginConfig {
  id: PluginType;
  name: string;
  icon: LucideIcon;
  plugin: any;
  defaultData: any;
}

export interface ComposePageState {
  activeTab: TabType;
  contentBlocks: ContentBlock[];
}

export interface ComposePageActions {
  setActiveTab: (tab: TabType) => void;
  addContentBlock: (pluginId: PluginType) => void;
  updateContentBlock: (id: string, data: any) => void;
  removeContentBlock: (id: string) => void;
  handleSave: () => Promise<void>;
}
