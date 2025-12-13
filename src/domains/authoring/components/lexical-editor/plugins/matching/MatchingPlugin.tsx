/**
 * Matching Plugin
 * Creates matching pair exercises (left items match to right items)
 */

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card } from "@/shared/components/ui/card";
import { IconHeaderCard } from "@/shared/components/ui/icon-header-card";
import { Shuffle, Plus, Trash2, GripVertical } from "lucide-react";
import type { ContentPlugin, MatchingData, MatchingItem } from "../../types";

/**
 * Matching Plugin Implementation
 */
export const MatchingPlugin: ContentPlugin = {
  id: "matching",
  name: "Matching",
  type: "content",
  icon: Shuffle,

  initialize: (editor) => {
    console.log("Matching plugin initialized with editor:", editor);
  },

  renderEditor: ({ data, onChange, editable }) => {
    return (
      <MatchingEditor data={data} onChange={onChange} editable={editable} />
    );
  },

  renderPreview: (data: MatchingData) => {
    return <MatchingPreview data={data} />;
  },

  serialize: (data: MatchingData) => {
    return JSON.stringify(data);
  },

  deserialize: (json: string) => {
    return JSON.parse(json) as MatchingData;
  },
};

/**
 * Matching Editor Component
 */
function MatchingEditor({
  data,
  onChange,
  editable,
}: {
  data: MatchingData;
  onChange: (data: MatchingData) => void;
  editable: boolean;
}) {
  const [items, setItems] = useState<MatchingItem[]>(
    data.items || [
      { id: "1", left: "", right: "" },
      { id: "2", left: "", right: "" },
    ]
  );

  const addItem = () => {
    const newItem: MatchingItem = {
      id: Date.now().toString(),
      left: "",
      right: "",
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

  const updateItem = (id: string, field: "left" | "right", value: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updated);
    onChange({ ...data, items: updated });
  };

  return (
    <IconHeaderCard
      Icon={Shuffle}
      title="Matching Exercise"
      description="Students will match items from the left to the right"
      bgClass="bg-blue-100"
      iconClass="text-blue-600"
    >
      {/* Title & Instructions */}
      <div className="space-y-2">
        <div>
          <Label>Title (optional)</Label>
          <Input
            placeholder="e.g., Match the countries to their capitals"
            value={data.title || ""}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            disabled={!editable}
          />
        </div>
        <div>
          <Label>Instructions (optional)</Label>
          <Input
            placeholder="e.g., Draw lines to connect each country with its capital"
            value={data.instructions || ""}
            onChange={(e) =>
              onChange({ ...data, instructions: e.target.value })
            }
            disabled={!editable}
          />
        </div>
      </div>

      {/* Matching Pairs */}
      <div className="space-y-3">
        <Label>Matching Pairs</Label>
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
            <span className="text-sm font-medium w-8">{index + 1}.</span>
            <Input
              placeholder="Left item"
              value={item.left}
              onChange={(e) => updateItem(item.id, "left", e.target.value)}
              disabled={!editable}
              className="flex-1"
            />
            <span className="text-muted-foreground">→</span>
            <Input
              placeholder="Right item"
              value={item.right}
              onChange={(e) => updateItem(item.id, "right", e.target.value)}
              disabled={!editable}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
              disabled={!editable || items.length <= 2}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
          Add Pair
        </Button>
      )}

      {/* Options */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="shuffle"
          checked={data.shuffle || false}
          onChange={(e) => onChange({ ...data, shuffle: e.target.checked })}
          disabled={!editable}
          className="h-4 w-4"
        />
        <Label htmlFor="shuffle" className="text-sm">
          Shuffle items for students
        </Label>
      </div>
    </IconHeaderCard>
  );
}

/**
 * Matching Preview Component (Student View)
 */
function MatchingPreview({ data }: { data: MatchingData }) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {data.title && <h4 className="font-semibold">{data.title}</h4>}
        {data.instructions && (
          <p className="text-sm text-muted-foreground">{data.instructions}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {data.items.map((item, index) => (
              <div
                key={item.id}
                className="p-3 border rounded bg-blue-50 cursor-pointer hover:bg-blue-100"
              >
                {index + 1}. {item.left || "(empty)"}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {data.items.map((item) => (
              <div
                key={item.id}
                className="p-3 border rounded bg-green-50 cursor-pointer hover:bg-green-100"
              >
                {item.right || "(empty)"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
