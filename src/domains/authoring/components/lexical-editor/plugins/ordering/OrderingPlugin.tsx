/* eslint-disable react-refresh/only-export-components */
/**
 * Ordering / Sequencing Plugin
 * Creates exercises where students must arrange items in the correct order
 */

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  MiniRichEditor,
  RichTextRenderer,
} from "../../components/mini-rich-editor";
import { IconHeaderCard } from "@/shared/components/ui/icon-header-card";
import {
  ListOrdered,
  Plus,
  Trash2,
  GripVertical,
  Check,
  RefreshCw,
} from "lucide-react";
import type { ContentPlugin } from "../../types/index";
import { cn } from "@/shared/lib/utils/mergeClass";

/**
 * Ordering Data Types
 */
export interface OrderingItem {
  id: string;
  text: string;
}

export interface OrderingData {
  type: "ordering";
  question?: string;
  items: OrderingItem[];
}

/**
 * Ordering Plugin Implementation
 */
export const OrderingPlugin: ContentPlugin = {
  id: "ordering",
  name: "Ordering",
  type: "content",
  icon: ListOrdered,

  initialize: (editor) => {
    console.log("Ordering plugin initialized with editor:", editor);
  },

  renderEditor: ({ data, onChange, editable, actions, onRemove }) => {
    return (
      <OrderingEditor
        data={data}
        onChange={onChange}
        editable={editable}
        actions={actions}
        onRemove={onRemove}
      />
    );
  },

  renderPreview: (options: { data: OrderingData; blockId?: string }) => {
    return <OrderingPreview data={options.data} />;
  },

  serialize: (data: OrderingData) => {
    return JSON.stringify(data);
  },

  deserialize: (json: string) => {
    return JSON.parse(json) as OrderingData;
  },
};

/**
 * Ordering Editor Component
 */
function OrderingEditor({
  data,
  onChange,
  editable,
  actions,
  onRemove,
}: {
  data: OrderingData;
  onChange: (data: OrderingData) => void;
  editable: boolean;
  actions?: React.ReactNode;
  onRemove?: () => void;
}) {
  const [items, setItems] = useState<OrderingItem[]>(
    data.items || [
      { id: "1", text: "Step 1" },
      { id: "2", text: "Step 2" },
      { id: "3", text: "Step 3" },
    ],
  );

  const addItem = () => {
    const newItem: OrderingItem = {
      id: Date.now().toString(),
      text: "",
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

  const updateItem = (id: string, text: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, text } : item,
    );
    setItems(updated);
    onChange({ ...data, items: updated });
  };

  // Simple drag and drop reordering for editor
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("index", index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("index"));
    if (isNaN(dragIndex) || dragIndex === dropIndex) return;

    const newItems = [...items];
    const [movedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, movedItem);

    setItems(newItems);
    onChange({ ...data, items: newItems });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <IconHeaderCard
      Icon={ListOrdered}
      title="Ordering"
      description="Students arrange items in the correct order"
      bgClass="bg-indigo-100"
      iconClass="text-indigo-600"
      actions={actions}
      onRemove={onRemove}
    >
      <div className="space-y-4">
        <div>
          <Label>Question / Instructions</Label>
          <MiniRichEditor
            placeholder="e.g., Arrange the following events in chronological order"
            value={data.question || ""}
            onChange={(value) => onChange({ ...data, question: value })}
            disabled={!editable}
          />
        </div>

        <div className="space-y-2">
          <Label>Items (in correct order)</Label>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-2 group"
                draggable={editable}
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 font-medium text-sm text-slate-500",
                    editable &&
                      "cursor-move group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors",
                  )}
                >
                  <span className={cn(editable && "group-hover:hidden")}>
                    {index + 1}
                  </span>
                  <GripVertical
                    className={cn(
                      "hidden h-4 w-4",
                      editable && "group-hover:block",
                    )}
                  />
                </div>

                <MiniRichEditor
                  placeholder={`Item ${index + 1}`}
                  value={item.text}
                  onChange={(value) => updateItem(item.id, value)}
                  disabled={!editable}
                  className="flex-1"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  disabled={!editable || items.length <= 2}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {editable && (
            <Button
              variant="outline"
              size="sm"
              onClick={addItem}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          )}
        </div>
      </div>
    </IconHeaderCard>
  );
}

/**
 * Ordering Preview Component (Student View)
 */
function OrderingPreview({ data }: { data: OrderingData }) {
  const [currentOrder, setCurrentOrder] = useState<OrderingItem[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );

  // Shuffle items on init
  useEffect(() => {
    if (data.items) {
      // Create a copy and shuffle
      const shuffled = [...data.items].sort(() => Math.random() - 0.5);
      setCurrentOrder(shuffled);
    }
  }, [data.items]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("startIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (status === "correct") return; // Lock if correct

    const startIndex = parseInt(e.dataTransfer.getData("startIndex"));
    if (isNaN(startIndex) || startIndex === dropIndex) return;

    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(startIndex, 1);
    newOrder.splice(dropIndex, 0, movedItem);

    setCurrentOrder(newOrder);
    setStatus("idle"); // Reset status on change
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const checkAnswer = () => {
    const isCorrect = currentOrder.every(
      (item, index) => item.id === data.items[index].id,
    );
    setStatus(isCorrect ? "correct" : "incorrect");
  };

  const reset = () => {
    const shuffled = [...data.items].sort(() => Math.random() - 0.5);
    setCurrentOrder(shuffled);
    setStatus("idle");
  };

  return (
    <div className="space-y-6">
      {data.question && (
        <RichTextRenderer
          content={data.question}
          className="font-semibold text-lg"
        />
      )}

      <div className="space-y-3">
        {currentOrder.map((item, index) => (
          <div
            key={item.id}
            draggable={status !== "correct"}
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            className={cn(
              "flex items-center gap-4 p-3 rounded-lg border bg-white transition-all",
              status === "idle" &&
                "cursor-move hover:border-indigo-300 hover:shadow-sm",
              status === "correct" && "border-green-200 bg-green-50",
              status === "incorrect" && "border-red-200 bg-red-50",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 font-medium text-slate-500 select-none",
                status === "correct" && "bg-green-200 text-green-700",
                status === "incorrect" && "bg-red-200 text-red-700",
              )}
            >
              {index + 1}
            </div>

            <div className="flex-1">
              <RichTextRenderer content={item.text} />
            </div>

            <GripVertical
              className={cn(
                "h-5 w-5 text-slate-400",
                status !== "idle" && "hidden",
              )}
            />

            {status === "correct" && (
              <Check className="h-5 w-5 text-green-600" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={checkAnswer}
          disabled={status === "correct"}
          className={cn(
            status === "correct" && "bg-green-600 hover:bg-green-700",
            status === "incorrect" && "bg-red-600 hover:bg-red-700",
          )}
        >
          {status === "idle" && "Check Answer"}
          {status === "correct" && "Correct!"}
          {status === "incorrect" && "Try Again"}
        </Button>

        <Button variant="outline" onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
