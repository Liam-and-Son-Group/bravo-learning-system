/* eslint-disable react-refresh/only-export-components */
/**
 * Fill in Blank Plugin
 * Creates fill-in-the-blank exercises with text and answer blanks
 */

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { IconHeaderCard } from "@/shared/components/ui/icon-header-card";
import { Badge } from "@/shared/components/ui/badge";
import { FileText, Plus, Trash2 } from "lucide-react";
import type {
  ContentPlugin,
  FillInBlankData,
  BlankItem,
} from "../../types/index";

/**
 * Fill in Blank Plugin Implementation
 */
export const FillInBlankPlugin: ContentPlugin = {
  id: "fill-in-blank",
  name: "Fill in Blank",
  type: "content",
  icon: FileText,

  initialize: (editor) => {
    console.log("Fill in Blank plugin initialized with editor:", editor);
  },

  renderEditor: ({ data, onChange, editable }) => {
    return (
      <FillInBlankEditor
        data={data}
        onChange={onChange}
        editable={editable}
      />
    );
  },

  renderPreview: (options: { data: FillInBlankData; blockId?: string }) => {
    return <FillInBlankPreview data={options.data} />;
  },

  serialize: (data: FillInBlankData) => {
    return JSON.stringify(data);
  },

  deserialize: (json: string) => {
    return JSON.parse(json) as FillInBlankData;
  },
};

/**
 * Fill in Blank Editor Component
 */
function FillInBlankEditor({
  data,
  onChange,
  editable,
}: {
  data: FillInBlankData;
  onChange: (data: FillInBlankData) => void;
  editable: boolean;
  actions?: React.ReactNode;
  onRemove?: () => void;
}) {
  const [items, setItems] = useState<BlankItem[]>(
    data.items || [
      { id: "1", text: "The capital of France is _____.", answer: "Paris" },
    ]
  );

  const addItem = () => {
    const newItem: BlankItem = {
      id: Date.now().toString(),
      text: "Enter your sentence with _____ for blanks",
      answer: "",
    };
    const updated = [...items, newItem];
    setItems(updated);
    onChange({ ...data, items: updated });
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onChange({ ...data, items: updated });
  };

  const updateItem = (
    id: string,
    field: keyof BlankItem,
    value: string | string[]
  ) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updated);
    onChange({ ...data, items: updated });
  };

  return (
    <IconHeaderCard
      Icon={FileText}
      title="Fill in the Blank"
      description="Students will fill in missing words"
      bgClass="bg-green-100"
      iconClass="text-green-600"
    >
      {/* Title & Instructions */}
      <div className="space-y-2">
        <div>
          <Label>Title (optional)</Label>
          <Input
            placeholder="e.g., Complete the sentences"
            value={data.title || ""}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            disabled={!editable}
          />
        </div>
        <div>
          <Label>Instructions (optional)</Label>
          <Input
            placeholder="e.g., Fill in the blanks with the correct words"
            value={data.instructions || ""}
            onChange={(e) =>
              onChange({ ...data, instructions: e.target.value })
            }
            disabled={!editable}
          />
        </div>
      </div>

      {/* Blank Items */}
      <div className="space-y-4">
        <Label>Sentences with Blanks</Label>
        {items.map((item, index) => (
          <div key={item.id} className="space-y-2 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Question {index + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                disabled={!editable || items.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label className="text-xs">Sentence (use _____ for blank)</Label>
              <Input
                placeholder="The capital of France is _____."
                value={item.text}
                onChange={(e) => updateItem(item.id, "text", e.target.value)}
                disabled={!editable}
              />
            </div>

            <div>
              <Label className="text-xs">Correct Answer</Label>
              <Input
                placeholder="Paris"
                value={item.answer}
                onChange={(e) => updateItem(item.id, "answer", e.target.value)}
                disabled={!editable}
              />
            </div>

            <div>
              <Label className="text-xs">
                Alternative Answers (optional, comma-separated)
              </Label>
              <Input
                placeholder="paris, PARIS"
                value={item.alternatives?.join(", ") || ""}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    "alternatives",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                disabled={!editable}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      {editable && (
        <Button
          variant="outline"
          size="sm"
          onClick={addItem}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      )}

      {/* Options */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="caseSensitive"
          checked={data.caseSensitive || false}
          onChange={(e) =>
            onChange({ ...data, caseSensitive: e.target.checked })
          }
          disabled={!editable}
          className="h-4 w-4"
        />
        <Label htmlFor="caseSensitive" className="text-sm">
          Case sensitive answers
        </Label>
      </div>
    </IconHeaderCard>
  );
}

/**
 * Fill in Blank Preview Component (Student View)
 */
function FillInBlankPreview({ data }: { data: FillInBlankData }) {
  return (
    <div className="space-y-4">
      {data.title && <h4 className="font-semibold">{data.title}</h4>}
      {data.instructions && (
        <p className="text-sm text-muted-foreground">{data.instructions}</p>
      )}
      <div className="space-y-4">
        {data.items.map((item, index) => {
          const parts = item.text.split("_____");
          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-medium">{index + 1}.</span>
                {parts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < parts.length - 1 && (
                      <input
                        type="text"
                        className="inline-block w-32 px-2 py-1 border-b-2 border-blue-500 focus:outline-none"
                        placeholder="___"
                      />
                    )}
                  </span>
                ))}
              </div>
              {item.alternatives && item.alternatives.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-6">
                  <span>Accepts:</span>
                  {item.alternatives.map((alt, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {alt}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
