import {
  Shuffle,
  PenLine,
  CheckSquare,
  Move,
  Code,
  BarChart,
  Layers,
  ListOrdered,
} from "lucide-react";
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
  CodeBlockPlugin as CodeBlockPluginNew,
  PollPlugin as PollPluginNew,
  FlashcardPlugin as FlashcardPluginNew,
  OrderingPlugin as OrderingPluginNew,
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
  {
    id: "code-block",
    name: "Code Block",
    icon: Code,
    plugin: createPluginAdapter(CodeBlockPluginNew),
    defaultData: {
      code: "",
      language: "javascript",
    } as PluginData,
  },
  {
    id: "poll",
    name: "Poll",
    icon: BarChart,
    plugin: createPluginAdapter(PollPluginNew),
    defaultData: {
      question: "",
      options: [
        { id: "1", text: "Option 1" },
        { id: "2", text: "Option 2" },
      ],
    } as PluginData,
  },
  {
    id: "flashcard",
    name: "Flashcard",
    icon: Layers,
    plugin: createPluginAdapter(FlashcardPluginNew),
    defaultData: {
      front: "",
      back: "",
    } as PluginData,
  },
  {
    id: "ordering",
    name: "Ordering",
    icon: ListOrdered,
    plugin: createPluginAdapter(OrderingPluginNew),
    defaultData: {
      question: "",
      items: [
        { id: "1", text: "Step 1" },
        { id: "2", text: "Step 2" },
        { id: "3", text: "Step 3" },
      ],
    } as PluginData,
  },
];
