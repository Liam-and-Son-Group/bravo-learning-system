import { Shuffle, PenLine, CheckSquare, Move } from "lucide-react";
import type {
  PluginConfig,
  Plugin,
  PluginEditorProps,
  PluginData,
} from "../types/compose";
import {
  MatchingPlugin as MatchingPluginNew,
  FillInBlankPlugin as FillInBlankPluginNew,
  MultipleChoicePlugin as MultipleChoicePluginNew,
  DragDropPlugin as DragDropPluginNew,
} from "../components/lexical-editor/plugins";

/**
 * Adapter: Convert new ContentPlugin to old Plugin interface
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createPluginAdapter<T = any>(newPlugin: any): Plugin<T> {
  return {
    renderEditor: (props: PluginEditorProps<T>) => {
      return newPlugin.renderEditor({
        data: props.data,
        onChange: props.onChange,
        editable: props.editable ?? true,
        actions: props.actions,
        onRemove: props.onRemove,
      });
    },
    renderPreview: (props) => {
      return newPlugin.renderPreview({
        data: props.data,
        blockId: props.blockId,
      });
    },
  };
}

/**
 * Plugin configurations for the compose page
 * Uses the new plugin architecture from components/lexical-editor/plugins
 */
export const PLUGIN_CONFIGS: PluginConfig[] = [
  {
    id: "matching",
    name: "Matching",
    icon: Shuffle,
    plugin: createPluginAdapter(MatchingPluginNew),
    defaultData: {
      items: [
        { id: "1", left: "", right: "" },
        { id: "2", left: "", right: "" },
      ],
    } as PluginData,
  },
  {
    id: "fill-in-blank",
    name: "Fill in Blank",
    icon: PenLine,
    plugin: createPluginAdapter(FillInBlankPluginNew),
    defaultData: {
      items: [{ id: "1", text: "", answer: "" }],
    } as PluginData,
  },
  {
    id: "multiple-choice",
    name: "Multiple Choice",
    icon: CheckSquare,
    plugin: createPluginAdapter(MultipleChoicePluginNew),
    defaultData: {
      question: "",
      allowMultiple: false,
      options: [{ text: "Option A", isCorrect: true }],
    } as PluginData,
  },
  {
    id: "drag-drop",
    name: "Drag and Drop",
    icon: Move,
    plugin: createPluginAdapter(DragDropPluginNew),
    defaultData: {
      categories: [{ id: "1", name: "Category 1" }],
      items: [{ id: "1", text: "", categoryId: "1" }],
    } as PluginData,
  },
];
