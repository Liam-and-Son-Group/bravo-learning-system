/* eslint-disable react-refresh/only-export-components */
/**
 * Matching Plugin
 * Creates matching pair exercises (left items match to right items)
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Shuffle, Plus, Trash2, GripVertical, ArrowRight } from "lucide-react";
import type { ContentPlugin, MatchingData } from "../..";
import type { MatchingItem } from "../../types/matching";

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

  renderEditor: ({ data, onChange, editable, actions, onRemove }) => {
    console.log("MatchingPlugin renderEditor - onRemove:", onRemove);
    return (
      <MatchingEditor
        data={data}
        onChange={onChange}
        editable={editable}
        actions={actions}
        onRemove={onRemove}
      />
    );
  },

  renderPreview: (options: { data: MatchingData; blockId?: string }) => {
    return <MatchingPreview data={options.data} blockId={options.blockId} />;
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
  actions,
  onRemove,
}: {
  data: MatchingData;
  onChange: (data: MatchingData) => void;
  editable: boolean;
  actions?: React.ReactNode;
  onRemove?: () => void;
}) {
  const [items, setItems] = useState<MatchingItem[]>(() => {
    const initialItems = data.items || [
      { id: "1", left: "", right: "" },
      { id: "2", left: "", right: "" },
    ];
    // Initialize correctAnswerId if not set (defaults to matching by index)
    return initialItems.map((item, index) => ({
      ...item,
      correctAnswerId:
        item.correctAnswerId || initialItems[index]?.id || item.id,
    }));
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sync items with data.items when data changes from outside
  useEffect(() => {
    if (data.items && JSON.stringify(data.items) !== JSON.stringify(items)) {
      const syncedItems = data.items.map((item, index) => ({
        ...item,
        correctAnswerId:
          item.correctAnswerId || data.items[index]?.id || item.id,
      }));
      setItems(syncedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.items]);

  const addItem = () => {
    const newId = Date.now().toString();
    const newItem: MatchingItem = {
      id: newId,
      left: "",
      right: "",
      correctAnswerId: newId, // Default to itself
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

  const updateCorrectAnswer = (leftItemId: string, rightItemId: string) => {
    const updated = items.map((item) =>
      item.id === leftItemId ? { ...item, correctAnswerId: rightItemId } : item
    );
    setItems(updated);
    onChange({ ...data, items: updated });
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updated = [...items];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setItems(updated);
    onChange({ ...data, items: updated });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (fromIndex !== toIndex) {
      moveItem(fromIndex, toIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const shuffleLeftColumn = () => {
    const updated = [...items];
    // Fisher-Yates shuffle for left values only
    const leftValues = updated.map((item) => item.left);
    for (let i = leftValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [leftValues[i], leftValues[j]] = [leftValues[j], leftValues[i]];
    }
    // Apply shuffled left values back to items
    leftValues.forEach((value, index) => {
      updated[index].left = value;
    });
    setItems(updated);
    onChange({ ...data, items: updated });
  };

  const shuffleRightColumn = () => {
    const updated = [...items];
    // Fisher-Yates shuffle for right values only
    const rightValues = updated.map((item) => item.right);
    for (let i = rightValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rightValues[i], rightValues[j]] = [rightValues[j], rightValues[i]];
    }
    // Apply shuffled right values back to items
    rightValues.forEach((value, index) => {
      updated[index].right = value;
    });
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
      actions={actions}
      onRemove={onRemove}
    >
      {/* Title & Instructions */}
      <div className="space-y-2">
        <div>
          <Label>Title (optional)</Label>
          <MiniRichEditor
            placeholder="e.g., Match the countries to their capitals"
            value={data.title || ""}
            onChange={(value) => onChange({ ...data, title: value })}
            disabled={!editable}
          />
        </div>
        <div>
          <Label>Instructions (optional)</Label>
          <MiniRichEditor
            placeholder="e.g., Draw lines to connect each country with its capital"
            value={data.instructions || ""}
            onChange={(value) => onChange({ ...data, instructions: value })}
            disabled={!editable}
          />
        </div>
      </div>

      {/* Order Settings */}
      <div className="space-y-3 p-4 border rounded-lg bg-blue-50/50">
        <Label className="text-sm font-semibold">Order Settings</Label>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Control the order in which items appear to students
          </p>

          {editable && items.length > 1 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleLeftColumn}
                className="text-xs"
              >
                <Shuffle className="h-3 w-3 mr-1" />
                Shuffle Left Column
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleRightColumn}
                className="text-xs"
              >
                <Shuffle className="h-3 w-3 mr-1" />
                Shuffle Right Column
              </Button>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shuffleLeft"
                checked={data.shuffleLeft || false}
                onChange={(e) =>
                  onChange({ ...data, shuffleLeft: e.target.checked })
                }
                disabled={!editable}
                className="h-4 w-4"
              />
              <Label htmlFor="shuffleLeft" className="text-sm font-normal">
                Auto-shuffle left column for each student
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shuffleRight"
                checked={data.shuffleRight || false}
                onChange={(e) =>
                  onChange({ ...data, shuffleRight: e.target.checked })
                }
                disabled={!editable}
                className="h-4 w-4"
              />
              <Label htmlFor="shuffleRight" className="text-sm font-normal">
                Auto-shuffle right column for each student
              </Label>
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-1">
            💡 Tip: Use manual shuffle buttons to set a specific order, or
            enable auto-shuffle for random order each time
          </div>
        </div>
      </div>

      {/* Correct Answers & Order */}
      <div className="space-y-3 p-4 border rounded-lg bg-green-50/50">
        <Label className="text-sm font-semibold">
          Correct Answers & Display Order
        </Label>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Set the correct answer for each left item by selecting the matching
            right item from the dropdown. The order here determines display
            position (unless auto-shuffle is enabled).
          </p>

          <div className="space-y-3 pt-2">
            {items.map((item, index) => {
              const correctAnswer = items.find(
                (i) => i.id === item.correctAnswerId
              );

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white border rounded"
                >
                  <span className="text-sm font-medium text-muted-foreground min-w-[24px]">
                    {index + 1}.
                  </span>
                  <div className="flex-1 grid grid-cols-2 gap-3 items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-600 font-medium">
                        Left:
                      </span>
                      <span className="text-sm font-medium">
                        {item.left || "(empty)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs flex gap-1 items-center text-green-600 font-medium">
                        <ArrowRight size={14} />
                        <p>Correct:</p>
                      </div>
                      {editable ? (
                        <Select
                          value={item.correctAnswerId || item.id}
                          onValueChange={(value) =>
                            updateCorrectAnswer(item.id, value)
                          }
                        >
                          <SelectTrigger className="h-8 text-sm min-w-0 max-w-full truncate">
                            <SelectValue
                              placeholder="Select correct answer"
                              className="truncate"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {items.map((rightItem) => (
                              <SelectItem
                                key={rightItem.id}
                                value={rightItem.id}
                                className="truncate"
                              >
                                {rightItem.right || "(empty)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm truncate max-w-[200px]">
                          {correctAnswer?.right || item.right || "(empty)"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-muted-foreground pt-1">
            ✓ Select the correct right-side answer for each left-side item
          </div>
        </div>
      </div>

      {/* Matching Pairs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold">Matching Pairs</Label>
            {editable && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <GripVertical className="h-3 w-3" />
                Drag to reorder
              </span>
            )}
          </div>
        </div>
        {items.map((item, index) => {
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index && draggedIndex !== index;

          return (
            <div
              key={item.id}
              className={`
                flex items-center gap-3 p-2 rounded-lg border-2 transition-all
                ${
                  isDragging
                    ? "opacity-50 border-blue-400 bg-blue-50 scale-95"
                    : "border-transparent"
                }
                ${
                  isDragOver
                    ? "border-blue-500 border-dashed bg-blue-50/50 scale-102"
                    : ""
                }
                ${editable && !isDragging ? "hover:bg-gray-50" : ""}
              `}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              {editable ? (
                <div
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  className="cursor-grab active:cursor-grabbing p-2 hover:bg-blue-100 rounded border border-gray-300 hover:border-blue-400"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors" />
                </div>
              ) : (
                <GripVertical className="h-5 w-5 text-gray-300" />
              )}
              <span className="text-sm font-medium w-8">{index + 1}.</span>
              <MiniRichEditor
                placeholder="Left item"
                value={item.left}
                onChange={(value) => updateItem(item.id, "left", value)}
                disabled={!editable}
                className="flex-1"
              />
              <span className="text-muted-foreground">→</span>
              <MiniRichEditor
                placeholder="Right item"
                value={item.right}
                onChange={(value) => updateItem(item.id, "right", value)}
                disabled={!editable}
                className="flex-1"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                disabled={!editable || items.length <= 2}
                title="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
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
    </IconHeaderCard>
  );
}

/**
 * Matching Preview Component (Student View) with Line Drawing
 */
function MatchingPreview({
  data,
  blockId = "default",
}: {
  data: MatchingData;
  blockId?: string;
}) {
  const [connections, setConnections] = useState<Map<string, string>>(
    new Map()
  );
  const [drawingFrom, setDrawingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  let leftItems = [...data.items];
  let rightItems = [...data.items];

  // Shuffle left column if auto-shuffle is enabled
  if (data.shuffleLeft) {
    const leftValues = leftItems.map((item) => item.left);
    for (let i = leftValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [leftValues[i], leftValues[j]] = [leftValues[j], leftValues[i]];
    }
    leftItems = leftItems.map((item, index) => ({
      ...item,
      left: leftValues[index],
    }));
  }

  // Shuffle right column if auto-shuffle is enabled
  if (data.shuffleRight) {
    const rightValues = rightItems.map((item) => item.right);
    for (let i = rightValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rightValues[i], rightValues[j]] = [rightValues[j], rightValues[i]];
    }
    rightItems = rightItems.map((item, index) => ({
      ...item,
      right: rightValues[index],
    }));
  }

  const handleLeftClick = (itemId: string) => {
    if (drawingFrom === itemId) {
      setDrawingFrom(null);
    } else {
      setDrawingFrom(itemId);
    }
  };

  const handleRightClick = (itemId: string) => {
    if (drawingFrom) {
      const newConnections = new Map(connections);
      newConnections.set(drawingFrom, itemId);
      setConnections(newConnections);
      setDrawingFrom(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (drawingFrom && containerRef) {
      const rect = containerRef.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const getItemCenter = (id: string, side: "left" | "right") => {
    const element = document.getElementById(`${blockId}-${side}-${id}`);
    if (!element || !containerRef) return null;

    const containerRect = containerRef.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
      x:
        elementRect.left -
        containerRect.left +
        (side === "left" ? elementRect.width : 0),
      y: elementRect.top - containerRect.top + elementRect.height / 2,
    };
  };

  return (
    <div className="space-y-4">
      {data.title && (
        <RichTextRenderer content={data.title} className="font-semibold" />
      )}
      {data.instructions && (
        <RichTextRenderer
          content={data.instructions}
          className="text-sm text-muted-foreground"
        />
      )}
      {(data.shuffleLeft || data.shuffleRight) && (
        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded">
          <Shuffle className="h-3 w-3" />
          <span>
            {data.shuffleLeft &&
              data.shuffleRight &&
              "Both columns will be randomized for each student"}
            {data.shuffleLeft &&
              !data.shuffleRight &&
              "Left column will be randomized for each student"}
            {!data.shuffleLeft &&
              data.shuffleRight &&
              "Right column will be randomized for each student"}
          </span>
        </div>
      )}
      <div
        className="relative"
        ref={(el) => setContainerRef(el)}
        onMouseMove={handleMouseMove}
      >
        {/* SVG for drawing lines */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {/* Draw existing connections */}
          {Array.from(connections.entries()).map(([leftId, rightId]) => {
            const startPos = getItemCenter(leftId, "left");
            const endPos = getItemCenter(rightId, "right");
            if (!startPos || !endPos) return null;

            return (
              <line
                key={`${leftId}-${rightId}`}
                x1={startPos.x}
                y1={startPos.y}
                x2={endPos.x}
                y2={endPos.y}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* Draw line being created */}
          {drawingFrom &&
            (() => {
              const startPos = getItemCenter(drawingFrom, "left");
              if (!startPos) return null;

              return (
                <line
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={mousePos.x}
                  y2={mousePos.y}
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                />
              );
            })()}
        </svg>

        <div className="grid grid-cols-2 gap-16 relative" style={{ zIndex: 2 }}>
          <div className="space-y-2">
            {leftItems.map((item, index) => {
              const isSelected = drawingFrom === item.id;
              const isConnected = connections.has(item.id);

              return (
                <div
                  key={item.id}
                  id={`${blockId}-left-${item.id}`}
                  onClick={() => handleLeftClick(item.id)}
                  className={`p-3 border-2 rounded cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-200 border-blue-500 shadow-lg"
                      : isConnected
                      ? "bg-blue-100 border-blue-400"
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                  }`}
                >
                  <span className="mr-2">{index + 1}.</span>
                  <RichTextRenderer content={item.left} className="inline" />
                </div>
              );
            })}
          </div>
          <div className="space-y-2">
            {rightItems.map((item) => {
              const isConnected = Array.from(connections.values()).includes(
                item.id
              );

              return (
                <div
                  key={item.id}
                  id={`${blockId}-right-${item.id}`}
                  onClick={() => handleRightClick(item.id)}
                  className={`p-3 border-2 rounded cursor-pointer transition-all ${
                    isConnected
                      ? "bg-green-100 border-green-400"
                      : "bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
                  } ${
                    drawingFrom ? "ring-2 ring-green-300 ring-opacity-50" : ""
                  }`}
                >
                  <RichTextRenderer content={item.right} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {connections.size > 0 && (
        <button
          onClick={() => setConnections(new Map())}
          className="text-sm text-red-600 hover:text-red-700 underline"
        >
          Clear all connections
        </button>
      )}
    </div>
  );
}
