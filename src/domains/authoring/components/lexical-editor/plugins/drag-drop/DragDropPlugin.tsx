/**
 * Drag & Drop Plugin
 * Creates exercises where students drag items into correct categories
 */

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card } from "@/shared/components/ui/card";
import { IconHeaderCard } from "@/shared/components/ui/icon-header-card";
import { Badge } from "@/shared/components/ui/badge";
import { Move, Plus, Trash2, GripVertical } from "lucide-react";
import type { ContentPlugin } from "../../types";

/**
 * Drag & Drop Data Types
 */
export interface DragDropItem {
  id: string;
  text: string;
  categoryId: string;
}

export interface DragDropCategory {
  id: string;
  name: string;
  color?: string;
}

export interface DragDropData {
  type: "drag-drop";
  title?: string;
  instructions?: string;
  categories: DragDropCategory[];
  items: DragDropItem[];
  showFeedback?: boolean;
}

/**
 * Drag & Drop Plugin Implementation
 */
export const DragDropPlugin: ContentPlugin = {
  id: "drag-drop",
  name: "Drag & Drop",
  type: "content",
  icon: Move,

  initialize: (editor) => {
    console.log("Drag & Drop plugin initialized with editor:", editor);
  },

  renderEditor: ({ data, onChange, editable }) => {
    return (
      <DragDropEditor data={data} onChange={onChange} editable={editable} />
    );
  },

  renderPreview: (data: DragDropData) => {
    return <DragDropPreview data={data} />;
  },

  serialize: (data: DragDropData) => {
    return JSON.stringify(data);
  },

  deserialize: (json: string) => {
    return JSON.parse(json) as DragDropData;
  },
};

/**
 * Drag & Drop Editor Component
 */
function DragDropEditor({
  data,
  onChange,
  editable,
}: {
  data: DragDropData;
  onChange: (data: DragDropData) => void;
  editable: boolean;
}) {
  const [categories, setCategories] = useState<DragDropCategory[]>(
    data.categories || [
      { id: "1", name: "Category 1" },
      { id: "2", name: "Category 2" },
    ]
  );

  const [items, setItems] = useState<DragDropItem[]>(
    data.items || [
      { id: "1", text: "Item 1", categoryId: "1" },
      { id: "2", text: "Item 2", categoryId: "2" },
    ]
  );

  const addCategory = () => {
    const newCategory: DragDropCategory = {
      id: Date.now().toString(),
      name: `Category ${categories.length + 1}`,
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    onChange({ ...data, categories: updated, items });
  };

  const removeCategory = (id: string) => {
    const updated = categories.filter((cat) => cat.id !== id);
    setCategories(updated);
    onChange({ ...data, categories: updated, items });
  };

  const updateCategory = (
    id: string,
    field: keyof DragDropCategory,
    value: string
  ) => {
    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, [field]: value } : cat
    );
    setCategories(updated);
    onChange({ ...data, categories: updated, items });
  };

  const addItem = () => {
    const newItem: DragDropItem = {
      id: Date.now().toString(),
      text: "",
      categoryId: categories[0]?.id || "",
    };
    const updated = [...items, newItem];
    setItems(updated);
    onChange({ ...data, categories, items: updated });
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onChange({ ...data, categories, items: updated });
  };

  const updateItem = (id: string, field: keyof DragDropItem, value: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updated);
    onChange({ ...data, categories, items: updated });
  };

  return (
    <IconHeaderCard
      Icon={Move}
      title="Drag & Drop Exercise"
      description="Students will drag items into correct categories"
      bgClass="bg-orange-100"
      iconClass="text-orange-600"
    >
      {/* Title & Instructions */}
      <div className="space-y-2">
        <div>
          <Label>Title (optional)</Label>
          <Input
            placeholder="e.g., Categorize the animals"
            value={data.title || ""}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            disabled={!editable}
          />
        </div>
        <div>
          <Label>Instructions (optional)</Label>
          <Input
            placeholder="e.g., Drag each animal to its correct habitat"
            value={data.instructions || ""}
            onChange={(e) =>
              onChange({ ...data, instructions: e.target.value })
            }
            disabled={!editable}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <Label>Categories</Label>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Category name"
              value={category.name}
              onChange={(e) =>
                updateCategory(category.id, "name", e.target.value)
              }
              disabled={!editable}
              className="flex-1"
            />
            <Input
              type="color"
              value={category.color || "#3b82f6"}
              onChange={(e) =>
                updateCategory(category.id, "color", e.target.value)
              }
              disabled={!editable}
              className="w-16"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeCategory(category.id)}
              disabled={!editable || categories.length <= 2}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {editable && (
          <Button
            variant="outline"
            size="sm"
            onClick={addCategory}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {/* Items */}
      <div className="space-y-3">
        <Label>Draggable Items</Label>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Item text"
              value={item.text}
              onChange={(e) => updateItem(item.id, "text", e.target.value)}
              disabled={!editable}
              className="flex-1"
            />
            <select
              value={item.categoryId}
              onChange={(e) =>
                updateItem(item.id, "categoryId", e.target.value)
              }
              disabled={!editable}
              className="px-3 py-2 border rounded-md"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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

        {editable && (
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        )}
      </div>

      {/* Options */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="showFeedback"
          checked={data.showFeedback || false}
          onChange={(e) =>
            onChange({ ...data, showFeedback: e.target.checked })
          }
          disabled={!editable}
          className="h-4 w-4"
        />
        <Label htmlFor="showFeedback" className="text-sm">
          Show feedback after each drop
        </Label>
      </div>
    </IconHeaderCard>
  );
}

/**
 * Drag & Drop Preview Component (Student View)
 */
function DragDropPreview({ data }: { data: DragDropData }) {
  const [droppedItems, setDroppedItems] = useState<Record<string, string[]>>(
    {}
  );

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("itemId", itemId);
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");

    setDroppedItems((prev) => {
      const updated = { ...prev };
      // Remove from previous category
      Object.keys(updated).forEach((catId) => {
        updated[catId] = updated[catId].filter((id) => id !== itemId);
      });
      // Add to new category
      updated[categoryId] = [...(updated[categoryId] || []), itemId];
      return updated;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const availableItems = data.items.filter(
    (item) => !Object.values(droppedItems).flat().includes(item.id)
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {data.title && <h4 className="font-semibold">{data.title}</h4>}
        {data.instructions && (
          <p className="text-sm text-muted-foreground">{data.instructions}</p>
        )}

        {/* Available Items */}
        <div className="p-4 border-2 border-dashed rounded-lg bg-gray-50">
          <Label className="text-sm mb-2 block">Drag from here:</Label>
          <div className="flex flex-wrap gap-2">
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                className="px-4 py-2 bg-white border rounded-lg cursor-move hover:shadow-md transition-shadow"
              >
                {item.text || "(empty)"}
              </div>
            ))}
            {availableItems.length === 0 && (
              <span className="text-sm text-muted-foreground">
                All items placed
              </span>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-4">
          {data.categories.map((category) => {
            const categoryItems = droppedItems[category.id] || [];
            return (
              <div
                key={category.id}
                onDrop={(e) => handleDrop(e, category.id)}
                onDragOver={handleDragOver}
                className="p-4 border-2 rounded-lg min-h-[120px]"
                style={{ borderColor: category.color || "#3b82f6" }}
              >
                <Badge
                  className="mb-3"
                  style={{
                    backgroundColor: category.color || "#3b82f6",
                  }}
                >
                  {category.name}
                </Badge>
                <div className="space-y-2">
                  {categoryItems.map((itemId) => {
                    const item = data.items.find((i) => i.id === itemId);
                    return (
                      <div
                        key={itemId}
                        className="px-3 py-2 bg-white border rounded"
                      >
                        {item?.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
