import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DropAnimation,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  AlertCircle,
  MoreVertical,
  Copy,
  Trash2,
  Plus,
  List,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils/mergeClass";
import type { PluginConfig, PluginType } from "../../types/compose";
import type { ContentBlock } from "../lexical-editor";

interface ComposeSidebarProps {
  pluginConfigs: PluginConfig[];
  onAddBlock: (pluginId: PluginType) => void;
  contentBlocks: ContentBlock[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  checkValidation: (block: ContentBlock) => boolean;
}

interface SortableItemProps {
  block: ContentBlock;
  pluginConfig: PluginConfig;
  isValid: boolean;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  isActive?: boolean;
}

const SortableItem = ({
  block,
  pluginConfig,
  isValid,
  onDuplicate,
  onRemove,
  isActive,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = pluginConfig.icon;

  const scrollToBlock = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(block.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 p-3 bg-card border rounded-lg mb-2 shadow-sm hover:border-primary/50 transition-colors",
        isActive && "border-primary ring-1 ring-primary",
        !isValid && "border-destructive/50 bg-destructive/5",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:text-foreground text-muted-foreground mr-1"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div
        className="flex-1 flex items-center gap-2 cursor-pointer min-w-0"
        onClick={scrollToBlock}
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-sm font-medium truncate">
          {pluginConfig.name}
        </span>
        {!isValid && (
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 ml-auto" />
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDuplicate(block.id)}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onRemove(block.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const ComposeSidebar = ({
  pluginConfigs,
  onAddBlock,
  contentBlocks,
  onReorder,
  onDuplicate,
  onRemove,
  checkValidation,
}: ComposeSidebarProps) => {
  const [activeTab, setActiveTab] = useState("modules");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = contentBlocks.findIndex((b) => b.id === active.id);
      const newIndex = contentBlocks.findIndex((b) => b.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <aside className="w-80 border-r bg-muted/10 flex flex-col h-full overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="modules">
              <Plus className="h-4 w-4 mr-2" />
              Plugins
            </TabsTrigger>
            <TabsTrigger value="outline">
              <List className="h-4 w-4 mr-2" />
              Outline
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="modules"
          className="flex-1 overflow-y-auto px-4 py-4 min-h-0"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1 text-sm">Add Content Module</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Click to add a module to your lesson
              </p>
            </div>
            <div className="space-y-2">
              {pluginConfigs.map((config) => (
                <Button
                  key={config.id}
                  variant="outline"
                  onClick={() => onAddBlock(config.id)}
                  className="w-full justify-start h-auto py-3 bg-card hover:bg-accent/50 hover:border-primary/50 transition-all text-left"
                >
                  <div className="bg-primary/5 p-2 rounded-md mr-3 text-primary">
                    <config.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{config.name}</div>
                    <div className="text-xs text-muted-foreground font-normal opacity-80">
                      Add {config.name.toLowerCase()} block
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="outline"
          className="flex-1 min-h-0 flex-col data-[state=active]:flex"
        >
          <div className="px-4 py-4">
            <h3 className="font-semibold mb-1 text-sm">Structure</h3>
            <p className="text-xs text-muted-foreground">
              Reorder and manage blocks
            </p>
          </div>

          <ScrollArea className="flex-1 px-4 pb-4">
            {contentBlocks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                No blocks added yet
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={contentBlocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {contentBlocks.map((block) => {
                    const config = pluginConfigs.find(
                      (c) => c.id === block.pluginId,
                    );
                    if (!config) return null;

                    return (
                      <SortableItem
                        key={block.id}
                        block={block}
                        pluginConfig={config}
                        isValid={checkValidation(block)}
                        onDuplicate={onDuplicate}
                        onRemove={onRemove}
                      />
                    );
                  })}
                </SortableContext>
                <DragOverlay dropAnimation={dropAnimation}>
                  {activeDragId
                    ? (() => {
                        const block = contentBlocks.find(
                          (b) => b.id === activeDragId,
                        );
                        const config = block
                          ? pluginConfigs.find((c) => c.id === block.pluginId)
                          : null;
                        if (!block || !config) return null;
                        return (
                          <SortableItem
                            block={block}
                            pluginConfig={config}
                            isValid={checkValidation(block)}
                            onDuplicate={onDuplicate}
                            onRemove={onRemove}
                            isActive
                          />
                        );
                      })()
                    : null}
                </DragOverlay>
              </DndContext>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
};
