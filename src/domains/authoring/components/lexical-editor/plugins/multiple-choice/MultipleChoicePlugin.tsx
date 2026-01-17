/* eslint-disable react-refresh/only-export-components */
/**
 * Multiple Choice Plugin
 * Creates single or multi-select question exercises
 */

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { IconHeaderCard } from "@/shared/components/ui/icon-header-card";
import { Badge } from "@/shared/components/ui/badge";
import {
  MiniRichEditor,
  RichTextRenderer,
} from "../../components/mini-rich-editor";
import { CheckCircle2, Circle, Plus, Trash2, ListChecks } from "lucide-react";
import type { ContentPlugin } from "../../types/index";

/**
 * Multiple Choice Data Types
 */
export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceData {
  type: "multiple-choice";
  question: string;
  explanation?: string;
  options: MultipleChoiceOption[];
  allowMultiple: boolean;
  shuffleOptions?: boolean;
  points?: number;
}

/**
 * Multiple Choice Plugin Implementation
 */
export const MultipleChoicePlugin: ContentPlugin = {
  id: "multiple-choice",
  name: "Multiple Choice",
  type: "content",
  icon: ListChecks,

  initialize: (editor) => {
    console.log("Multiple Choice plugin initialized with editor:", editor);
  },

  renderEditor: ({ data, onChange, editable, actions, onRemove }) => {
    return (
      <MultipleChoiceEditor
        data={data}
        onChange={onChange}
        editable={editable}
        actions={actions}
        onRemove={onRemove}
      />
    );
  },

  renderPreview: (options: { data: MultipleChoiceData; blockId?: string }) => {
    return <MultipleChoicePreview data={options.data} />;
  },

  serialize: (data: MultipleChoiceData) => {
    return JSON.stringify(data);
  },

  deserialize: (json: string) => {
    return JSON.parse(json) as MultipleChoiceData;
  },
};

/**
 * Multiple Choice Editor Component
 */
function MultipleChoiceEditor({
  data,
  onChange,
  editable,
  actions,
  onRemove,
}: {
  data: MultipleChoiceData;
  onChange: (data: MultipleChoiceData) => void;
  editable: boolean;
  actions?: React.ReactNode;
  onRemove?: () => void;
}) {
  const [options, setOptions] = useState<MultipleChoiceOption[]>(
    data.options || [
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
      { id: "3", text: "", isCorrect: false },
      { id: "4", text: "", isCorrect: false },
    ]
  );

  const addOption = () => {
    const newOption: MultipleChoiceOption = {
      id: Date.now().toString(),
      text: "",
      isCorrect: false,
    };
    const updated = [...options, newOption];
    setOptions(updated);
    onChange({ ...data, options: updated });
  };

  const removeOption = (id: string) => {
    const updated = options.filter((opt) => opt.id !== id);
    setOptions(updated);
    onChange({ ...data, options: updated });
  };

  const updateOption = (
    id: string,
    field: keyof MultipleChoiceOption,
    value: string | boolean
  ) => {
    const updated = options.map((opt) =>
      opt.id === id ? { ...opt, [field]: value } : opt
    );
    setOptions(updated);
    onChange({ ...data, options: updated });
  };

  const toggleCorrect = (id: string) => {
    const updated = options.map((opt) => {
      if (opt.id === id) {
        return { ...opt, isCorrect: !opt.isCorrect };
      }
      // If single select, uncheck others
      if (!data.allowMultiple && opt.isCorrect) {
        return { ...opt, isCorrect: false };
      }
      return opt;
    });
    setOptions(updated);
    onChange({ ...data, options: updated });
  };

  const correctCount = options.filter((opt) => opt.isCorrect).length;

  return (
    <IconHeaderCard
      Icon={ListChecks}
      title="Multiple Choice Question"
      description={
        data.allowMultiple
          ? "Students can select multiple answers"
          : "Students can select one answer"
      }
      bgClass="bg-purple-100"
      iconClass="text-purple-600"
      actions={actions}
      onRemove={onRemove}
    >
      {/* Question */}
      <div className="space-y-2">
        <Label>Question *</Label>
        <MiniRichEditor
          placeholder="Enter your question here..."
          value={data.question || ""}
          onChange={(value) => onChange({ ...data, question: value })}
          disabled={!editable}
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Answer Options</Label>
          {correctCount === 0 && (
            <Badge variant="destructive" className="text-xs">
              No correct answer selected
            </Badge>
          )}
          {correctCount > 0 && (
            <Badge variant="default" className="text-xs">
              {correctCount} correct {correctCount === 1 ? "answer" : "answers"}
            </Badge>
          )}
        </div>

        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-3">
            <Button
              variant={option.isCorrect ? "default" : "outline"}
              size="icon"
              onClick={() => toggleCorrect(option.id)}
              disabled={!editable}
              className="shrink-0"
            >
              {option.isCorrect ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </Button>
            <span className="text-sm font-medium w-8">
              {String.fromCharCode(65 + index)}.
            </span>
            <MiniRichEditor
              placeholder={`Option ${index + 1}`}
              value={option.text}
              onChange={(value) => updateOption(option.id, "text", value)}
              disabled={!editable}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeOption(option.id)}
              disabled={!editable || options.length <= 2}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Option Button */}
      {editable && (
        <Button
          variant="outline"
          size="sm"
          onClick={addOption}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      )}

      {/* Explanation */}
      <div className="space-y-2">
        <Label>Explanation (optional)</Label>
        <MiniRichEditor
          placeholder="Explain why the answer is correct..."
          value={data.explanation || ""}
          onChange={(value) => onChange({ ...data, explanation: value })}
          disabled={!editable}
        />
      </div>

      {/* Options */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allowMultiple"
            checked={data.allowMultiple || false}
            onChange={(e) =>
              onChange({ ...data, allowMultiple: e.target.checked })
            }
            disabled={!editable}
            className="h-4 w-4"
          />
          <Label htmlFor="allowMultiple" className="text-sm">
            Allow multiple correct answers
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="shuffleOptions"
            checked={data.shuffleOptions || false}
            onChange={(e) =>
              onChange({ ...data, shuffleOptions: e.target.checked })
            }
            disabled={!editable}
            className="h-4 w-4"
          />
          <Label htmlFor="shuffleOptions" className="text-sm">
            Shuffle options for students
          </Label>
        </div>
      </div>

      {/* Points */}
      <div className="flex items-center gap-3">
        <Label className="text-sm">Points:</Label>
        <Input
          type="number"
          min="0"
          value={data.points || 1}
          onChange={(e) =>
            onChange({ ...data, points: parseInt(e.target.value) || 1 })
          }
          disabled={!editable}
          className="w-24"
        />
      </div>
    </IconHeaderCard>
  );
}

/**
 * Multiple Choice Preview Component (Student View)
 */
function MultipleChoicePreview({ data }: { data: MultipleChoiceData }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (data.allowMultiple) {
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
    } else {
      newSelected.clear();
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  return (
    <div className="space-y-4">
      {/* Question */}
      <div>
        <RichTextRenderer
          content={data.question}
          className="font-semibold text-lg mb-2"
        />
        {data.allowMultiple && (
          <Badge variant="secondary" className="text-xs">
            Select all that apply
          </Badge>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {data.options.map((option, index) => {
          const isSelected = selected.has(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="font-medium">
                  {String.fromCharCode(65 + index)}.
                </span>
                <RichTextRenderer content={option.text} className="flex-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Points */}
      {data.points && (
        <div className="text-sm text-muted-foreground">
          Worth {data.points} {data.points === 1 ? "point" : "points"}
        </div>
      )}
    </div>
  );
}
