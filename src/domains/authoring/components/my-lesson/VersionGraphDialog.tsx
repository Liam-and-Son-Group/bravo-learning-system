/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Trash2, GitCommit, GitBranch, Clock, User } from "lucide-react";
import {
  useGetLessonVersionGraph,
  useDeleteWorkingDeskMutation,
  useGetLessonById,
} from "../../queries";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/shared/components/ui/scroll-area";
import { cn } from "@/shared/lib/utils/mergeClass";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface VersionGraphDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
}

export function VersionGraphDialog({
  open,
  onOpenChange,
  lessonId,
}: VersionGraphDialogProps) {
  const { data: graphData, isLoading: isGraphLoading } =
    useGetLessonVersionGraph(lessonId);
  const { data: lessonData, isLoading: isLessonLoading } =
    useGetLessonById(lessonId);
  const deleteDeskMutation = useDeleteWorkingDeskMutation();

  const isLoading = isGraphLoading || isLessonLoading;
  const currentVersionId = lessonData?.data?.currentVersionId;

  const handleDeleteDraft = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete draft "${name}"?`)) {
      deleteDeskMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Draft branch deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete draft");
        },
      });
    }
  };

  const nodes = graphData?.data?.nodes || [];
  const edges = graphData?.data?.edges || [];

  // Layout Logic
  // Main timeline (Versions) on top line
  // Drafts branch off downwards

  const versions = nodes
    .filter((n: any) => n.type === "VERSION")
    .sort(
      (a: any, b: any) =>
        new Date(a.data.createdAt).getTime() -
        new Date(b.data.createdAt).getTime(),
    );

  const drafts = nodes.filter((n: any) => n.type === "DRAFT");

  const CARD_WIDTH = 220;
  const CARD_HEIGHT = 100; // estimated
  const GAP_X = 60;
  const GAP_Y = 120; // Vertical gap for branches
  const START_X = 50;
  const START_Y = 50;

  const nodePositions: Record<string, { x: number; y: number }> = {};

  // 1. Position Versions (Main Line)
  versions.forEach((v: any, index: number) => {
    nodePositions[v.id] = {
      x: START_X + index * (CARD_WIDTH + GAP_X),
      y: START_Y,
    };
  });

  // 2. Position Drafts
  // Group drafts by their source version to avoid overlap
  const draftsBySource: Record<string, any[]> = {};
  drafts.forEach((d: any) => {
    // specific edge logic: find edge pointing TO this draft
    // The edge source is the version this draft branches from.
    const edge = edges.find((e: any) => e.target === d.id);
    const sourceId = edge ? edge.source : "unknown";
    if (!draftsBySource[sourceId]) draftsBySource[sourceId] = [];
    draftsBySource[sourceId].push(d);
  });

  drafts.forEach((d: any) => {
    const edge = edges.find((e: any) => e.target === d.id);
    const sourceId = edge ? edge.source : null;
    let x = START_X; // fallback
    let y = START_Y + GAP_Y;

    if (sourceId && nodePositions[sourceId]) {
      const parentPos = nodePositions[sourceId];
      // If multiple drafts from same parent, stack them strictly vertically or fan them out?
      // Stacking vertically is safer to avoid X collision with next version.
      const siblings = draftsBySource[sourceId];
      const indexInGroup = siblings.indexOf(d);

      x = parentPos.x; // Align directly under parent
      y = parentPos.y + GAP_Y + indexInGroup * (CARD_HEIGHT + 20);
    } else {
      // Orphan draft? Put at end.
      x = START_X + versions.length * (CARD_WIDTH + GAP_X);
    }
    nodePositions[d.id] = { x, y };
  });

  const getPath = (sourceId: string, targetId: string) => {
    const start = nodePositions[sourceId];
    const end = nodePositions[targetId];
    if (!start || !end) return "";

    // If perfectly vertical (Draft branching off)
    if (start.x === end.x) {
      // L-shape or straight line?
      // Straight line down is fine.
      return `M ${start.x + CARD_WIDTH / 2} ${start.y + CARD_HEIGHT} L ${end.x + CARD_WIDTH / 2} ${end.y}`;
    }

    // If horizontal (Version chain)
    // Connect right side of start to left side of end
    return `M ${start.x + CARD_WIDTH} ${start.y + CARD_HEIGHT / 2} L ${end.x} ${end.y + CARD_HEIGHT / 2}`;
  };

  // Calculate canvas size
  let maxX = 0;
  let maxY = 0;
  Object.values(nodePositions).forEach((pos) => {
    if (pos.x > maxX) maxX = pos.x;
    if (pos.y > maxY) maxY = pos.y;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 bg-slate-50/50">
          <div
            className="relative p-10 min-w-full min-h-full"
            style={{
              width: Math.max(maxX + CARD_WIDTH + 100, 1000),
              height: Math.max(maxY + CARD_HEIGHT + 100, 600),
            }}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                Loading...
              </div>
            ) : nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No versions found.
              </div>
            ) : (
              <TooltipProvider delayDuration={300}>
                {/* Connections Layer */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                    </marker>
                    <marker
                      id="arrowhead-orange"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                    </marker>
                  </defs>
                  {edges.map((edge: any) => {
                    if (
                      !nodePositions[edge.source] ||
                      !nodePositions[edge.target]
                    )
                      return null;
                    const isBranch = edge.type === "BRANCH";
                    return (
                      <path
                        key={edge.id}
                        d={getPath(edge.source, edge.target)}
                        stroke={isBranch ? "#f59e0b" : "#94a3b8"}
                        strokeWidth="2"
                        strokeDasharray={isBranch ? "5,5" : "0"}
                        fill="none"
                        markerEnd={
                          isBranch
                            ? "url(#arrowhead-orange)"
                            : "url(#arrowhead)"
                        }
                      />
                    );
                  })}
                </svg>

                {/* Nodes Layer */}
                {nodes.map((node: any) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;
                  const isDraft = node.type === "DRAFT";
                  const isCurrent = node.id === currentVersionId;

                  return (
                    <div
                      key={node.id}
                      className={cn(
                        "absolute z-10 flex flex-col p-4 rounded-xl border shadow-sm transition-all hover:shadow-md",
                        isDraft
                          ? "bg-amber-50 border-amber-200"
                          : "bg-white border-slate-200",
                        isCurrent
                          ? "ring-2 ring-primary ring-offset-2 shadow-lg"
                          : "",
                      )}
                      style={{
                        left: pos.x,
                        top: pos.y,
                        width: CARD_WIDTH,
                        minHeight: CARD_HEIGHT,
                      }}
                    >
                      {isCurrent && (
                        <span className="absolute -top-3 -right-3 flex h-6 w-6">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
                            style={{ animationDuration: "2s" }}
                          ></span>
                          <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500 items-center justify-center">
                            <GitCommit className="h-3 w-3 text-white" />
                          </span>
                        </span>
                      )}

                      {/* Header */}
                      <div className="flex justify-between items-start mb-2">
                        <Badge
                          variant={isDraft ? "outline" : "secondary"}
                          className={cn(
                            isDraft
                              ? "border-amber-500 text-amber-700 bg-amber-100"
                              : "",
                          )}
                        >
                          {isDraft ? (
                            <>
                              <GitBranch className="w-3 h-3 mr-1" /> Draft
                            </>
                          ) : (
                            <>
                              <GitCommit className="w-3 h-3 mr-1" />{" "}
                              {node.label}
                            </>
                          )}
                        </Badge>

                        {isDraft && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-amber-200 -mr-2 -mt-2"
                            onClick={() =>
                              handleDeleteDraft(node.id, node.label)
                            }
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="font-semibold text-sm truncate">
                              {node.label}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{node.label}</p>
                          </TooltipContent>
                        </Tooltip>

                        {node.data.message && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-muted-foreground italic line-clamp-2">
                                "{node.data.message}"
                              </p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px]">
                              <p>"{node.data.message}"</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        <div className="pt-2 flex flex-col gap-1 text-[10px] text-muted-foreground border-t mt-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">
                              {node.data.author?.name || "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {format(
                                new Date(node.data.createdAt),
                                "MMM d, h:mm a",
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </TooltipProvider>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
