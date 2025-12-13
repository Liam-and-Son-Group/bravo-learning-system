import { Shuffle, FileText, ListChecks, Move } from "lucide-react";
import {
  MatchingPlugin,
  FillInBlankPlugin,
  MultipleChoicePlugin,
  DragDropPlugin,
} from "../../components/lexical-editor";
import type { PluginConfig } from "./types";

export const PLUGIN_CONFIGS: PluginConfig[] = [
  {
    id: "matching",
    name: "Matching",
    icon: Shuffle,
    plugin: MatchingPlugin,
    defaultData: {
      type: "matching",
      items: [
        { id: "1", left: "", right: "" },
        { id: "2", left: "", right: "" },
      ],
    },
  },
  {
    id: "fill-in-blank",
    name: "Fill in Blank",
    icon: FileText,
    plugin: FillInBlankPlugin,
    defaultData: {
      type: "fill-in-blank",
      items: [
        {
          id: "1",
          text: "The capital of France is _____.",
          answer: "Paris",
        },
      ],
    },
  },
  {
    id: "multiple-choice",
    name: "Multiple Choice",
    icon: ListChecks,
    plugin: MultipleChoicePlugin,
    defaultData: {
      type: "multiple-choice",
      question: "",
      options: [
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
        { id: "3", text: "", isCorrect: false },
        { id: "4", text: "", isCorrect: false },
      ],
      allowMultiple: false,
      points: 1,
    },
  },
  {
    id: "drag-drop",
    name: "Drag & Drop",
    icon: Move,
    plugin: DragDropPlugin,
    defaultData: {
      type: "drag-drop",
      categories: [
        { id: "1", name: "Category 1" },
        { id: "2", name: "Category 2" },
      ],
      items: [
        { id: "1", text: "Item 1", categoryId: "1" },
        { id: "2", text: "Item 2", categoryId: "2" },
      ],
    },
  },
];
