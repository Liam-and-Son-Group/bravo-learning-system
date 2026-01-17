import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  GitBranch,
  GitCommit,
  Clock,
  User,
  Trash2,
  Eye,
  GitMerge,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ScrollArea, ScrollBar } from "@/shared/components/ui/scroll-area";
import { cn } from "@/shared/lib/utils/mergeClass";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import {
  useDeleteWorkingDeskMutation,
  useMergeBranchMutation,
} from "../../queries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

interface BranchVersion {
  id: string;
  createdAt: string;
  versionName?: string;
  authorName?: string;
  authorEmail?: string;
  authorAvatar?: string;
  message?: string;
}

interface Branch {
  id: string;
  name: string;
  message?: string;
  isMain: boolean;
  status: string;
  createdAt: string;
  latestVersion?: BranchVersion | null;
  versions?: BranchVersion[];
  parentBranchId?: string | null;
  branchedFromVersionId?: string | null;
}

interface BranchGraphModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: Branch[];
  currentBranchId?: string;
  lessonId?: string;
  currentVersionId?: string;
}

export const BranchGraphModal = ({
  open,
  onOpenChange,
  branches,
  currentBranchId,
  lessonId,
  currentVersionId,
}: BranchGraphModalProps) => {
  const deleteDeskMutation = useDeleteWorkingDeskMutation();
  const mergeBranchMutation = useMergeBranchMutation();

  const [pendingMergeBranch, setPendingMergeBranch] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleMergeBranch = (branchId: string, branchName: string) => {
    setPendingMergeBranch({ id: branchId, name: branchName });
  };

  const confirmMerge = () => {
    if (!pendingMergeBranch || !lessonId) return;

    mergeBranchMutation.mutate(
      {
        lessonId,
        sourceBranchId: pendingMergeBranch.id,
      },
      {
        onSuccess: () => {
          toast.success("Branch merged successfully");
          setSelectedNode(null);
          setPendingMergeBranch(null);
        },
        onError: () => {
          toast.error("Failed to merge branch");
          setPendingMergeBranch(null);
        },
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edges: any[] = [];

  // Helper to find parent node for edges
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const versionMap = new Map<string, any>();

  branches.forEach((branch) => {
    const versions =
      branch.versions || (branch.latestVersion ? [branch.latestVersion] : []);
    const sortedVersions = [...versions].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    sortedVersions.forEach((v, idx) => {
      if (!v) return;
      // Create Node
      const node = {
        id: v.id,
        // Simplified logic: Main branch = VERSION, Feature branch = DRAFT-like style for distinctness
        // Logic: If branch is NOT main, treat as "Draft" visual style (Amber)
        label: v.versionName || branch.name,
        data: {
          createdAt: v.createdAt,
          author: { name: v.authorName || v.authorEmail },
          message: branch.message || v.message,
        },
        branchId: branch.id,
        isMain: branch.isMain,
      };

      nodes.push(node);
      versionMap.set(v.id, node);

      // Create Edge from Previous Version in SAME branch
      if (idx > 0) {
        edges.push({
          id: `e-${sortedVersions[idx - 1].id}-${v.id}`,
          source: sortedVersions[idx - 1].id,
          target: v.id,
          type: "VERSION",
        });
      } else {
        // First version of this branch. Connect to Parent Branch?
        if (branch.branchedFromVersionId) {
          edges.push({
            id: `e-${branch.branchedFromVersionId}-${v.id}`,
            source: branch.branchedFromVersionId,
            target: v.id,
            type: "BRANCH",
          });
        }
      }
    });
  });

  const handleDeleteDraft = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete branch "${name}"?`)) {
      const targetBranch = branches.find(
        (b) =>
          b.latestVersion?.id === id || b.versions?.some((v) => v.id === id),
      );
      if (targetBranch) {
        deleteDeskMutation.mutate(targetBranch.id, {
          onSuccess: () => {
            toast.success("Branch deleted successfully");
          },
          onError: () => {
            toast.error("Failed to delete branch");
          },
        });
      }
    }
  };

  // Layout Logic: Horizontal Timeline (Git-style)
  // 1. Sort ALL nodes by time to establish the X-axis order (Chronological)
  // 2. Assign Lanes (Y-axis) to branches. Main = 0, others increment keys.

  const sortedNodes = [...nodes].sort(
    (a, b) =>
      new Date(a.data.createdAt).getTime() -
      new Date(b.data.createdAt).getTime(),
  );

  const branchLanes = new Map<string, number>();
  let laneCounter = 1;

  // Assign Main Branch to Lane 0
  const mainBranchId = branches.find((b) => b.isMain)?.id;
  if (mainBranchId) {
    branchLanes.set(mainBranchId, 0);
  }

  // Assign other branches to subsequent lanes
  branches.forEach((b) => {
    if (!b.isMain && !branchLanes.has(b.id)) {
      branchLanes.set(b.id, laneCounter++);
    }
  });

  const CARD_WIDTH = 220;
  const CARD_HEIGHT = 100;
  const GAP_X = 80;
  const GAP_Y = 60; // Vertical gap between lanes
  const START_X = 50;
  const START_Y = 50;

  const nodePositions: Record<string, { x: number; y: number }> = {};

  sortedNodes.forEach((node, index) => {
    const laneIndex = branchLanes.get(node.branchId) ?? 0;

    // X is purely based on chronological order (index)
    // This ensures no overlap and strict time flow left-to-right.
    // Optimization: We could compact X for parallel branches, but strictly linear is clearest for "tracing".
    const x = START_X + index * (CARD_WIDTH + GAP_X);

    // Y is based on Lane
    const y = START_Y + laneIndex * (CARD_HEIGHT + GAP_Y);

    nodePositions[node.id] = { x, y };
  });

  const getPath = (sourceId: string, targetId: string) => {
    const start = nodePositions[sourceId];
    const end = nodePositions[targetId];
    if (!start || !end) return "";

    // Card dimensions for connection points
    const startPt = { x: start.x + CARD_WIDTH, y: start.y + CARD_HEIGHT / 2 }; // Right middle
    const endPt = { x: end.x, y: end.y + CARD_HEIGHT / 2 }; // Left middle

    // Cubic Bezier Curve
    // Control points:
    // cp1: extend horizontally from start
    // cp2: extend horizontally from end (backwards)
    const dist = endPt.x - startPt.x;
    const cp1 = { x: startPt.x + dist * 0.5, y: startPt.y };
    const cp2 = { x: endPt.x - dist * 0.5, y: endPt.y };

    return `M ${startPt.x} ${startPt.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endPt.x} ${endPt.y}`;
  };

  let maxX = 0;
  let maxY = 0;
  Object.values(nodePositions).forEach((pos) => {
    if (pos.x > maxX) maxX = pos.x;
    if (pos.y > maxY) maxY = pos.y;
  });

  const [zoom, setZoom] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Branch & Version History
          </DialogTitle>
          <DialogDescription>
            Visual representation of all branches and their version history
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Graph Area */}
          <ScrollArea className="flex-1 bg-slate-50/50 relative">
            <div
              className="relative p-10 min-w-full min-h-full transition-transform duration-200 origin-top-left"
              style={{
                width: Math.max(maxX + CARD_WIDTH + 100, 1000) * zoom,
                height: Math.max(maxY + CARD_HEIGHT + 100, 600) * zoom,
                transform: `scale(${zoom})`,
              }}
            >
              <TooltipProvider delayDuration={300}>
                {/* Connections */}
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
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {edges.map((edge: any) => {
                    if (
                      !nodePositions[edge.source] ||
                      !nodePositions[edge.target]
                    )
                      return null;
                    const isBranch = edge.type === "BRANCH";
                    // Scale stroke width inversely to zoom to keep lines/markers visible
                    const dynamicStroke = 2 / zoom;

                    return (
                      <path
                        key={edge.id}
                        d={getPath(edge.source, edge.target)}
                        stroke={isBranch ? "#f59e0b" : "#94a3b8"}
                        strokeWidth={dynamicStroke}
                        strokeDasharray={
                          isBranch ? `${5 / zoom},${5 / zoom}` : "0"
                        }
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

                {/* Nodes */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {nodes.map((node: any) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;
                  const isDraft = !node.isMain;
                  let isCurrent = false;
                  if (currentVersionId) {
                    isCurrent = node.id === currentVersionId;
                  } else if (currentBranchId) {
                    isCurrent =
                      node.branchId === currentBranchId &&
                      node.id ===
                        branches.find((b) => b.id === currentBranchId)
                          ?.latestVersion?.id;
                  }
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={cn(
                        "absolute z-10 flex flex-col p-4 rounded-xl border shadow-sm transition-all hover:shadow-md cursor-pointer",
                        isDraft
                          ? "bg-amber-50 border-amber-200"
                          : "bg-white border-slate-200",
                        isCurrent
                          ? "ring-2 ring-primary ring-offset-2 shadow-lg"
                          : "",
                        isSelected ? "ring-2 ring-blue-500 ring-offset-1" : "",
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
                          <GitBranch className="w-3 h-3 mr-1" />
                          {isDraft
                            ? "Draft"
                            : node.label.length > 15
                              ? node.label.substring(0, 15) + "..."
                              : node.label}
                        </Badge>

                        {isDraft && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-amber-200 -mr-2 -mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDraft(node.id, node.label);
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <div className="font-semibold text-sm truncate">
                          {node.label}
                        </div>
                        {node.data.message && (
                          <p className="text-xs text-muted-foreground italic line-clamp-2">
                            "{node.data.message}"
                          </p>
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
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Zoom Controls */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white p-1 rounded-md border shadow-md z-20">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <span className="text-xl font-bold">-</span>
            </Button>
            <span className="text-sm font-medium w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 2}
            >
              <span className="text-xl font-bold">+</span>
            </Button>
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <Button variant="ghost" size="sm" onClick={handleResetZoom}>
              Reset
            </Button>
          </div>

          {/* Sidebar Details Panel */}
          {selectedNode && (
            <div className="w-[350px] border-l bg-white flex flex-col h-full shadow-2xl z-20">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <GitCommit className="w-4 h-4" />
                  Version Details
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSelectedNode(null)}
                >
                  <span className="text-lg">×</span>
                </Button>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Version Name
                    </h4>
                    <p className="text-lg font-semibold">
                      {selectedNode.label}
                    </p>
                    <Badge
                      variant={selectedNode.isMain ? "secondary" : "outline"}
                      className="mt-2"
                    >
                      {selectedNode.isMain
                        ? "Main Branch"
                        : "Draft / Feature Branch"}
                    </Badge>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Message
                      </h4>
                      <div className="bg-slate-50 p-3 rounded-md text-sm italic border">
                        {selectedNode.data.message || "No message provided"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Author
                        </h4>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                            {selectedNode.data.author?.name?.charAt(0) || "?"}
                          </div>
                          {selectedNode.data.author?.name || "Unknown"}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Date
                        </h4>
                        <p className="text-sm">
                          {format(new Date(selectedNode.data.createdAt), "PPP")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(selectedNode.data.createdAt), "p")}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Actions
                      </h4>
                      <div className="flex flex-col gap-2">
                        {/* Placeholder actions */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Version
                        </Button>
                        {!selectedNode.isMain && (
                          <>
                            {branches.find(
                              (b) => b.id === selectedNode.branchId,
                            )?.status !== "MERGED" && (
                              <Button
                                variant="default"
                                size="sm"
                                className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                                onClick={() =>
                                  handleMergeBranch(
                                    selectedNode.branchId,
                                    selectedNode.label,
                                  )
                                }
                              >
                                <GitMerge className="w-4 h-4 mr-2" />
                                Merge to Main
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() =>
                                handleDeleteDraft(
                                  selectedNode.id,
                                  selectedNode.label,
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Branch
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>

      <AlertDialog
        open={!!pendingMergeBranch}
        onOpenChange={(open) => !open && setPendingMergeBranch(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Merge Branch to Main</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to merge "{pendingMergeBranch?.name}" into
              Main? This will overwrite the current Main version with the
              changes from this branch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmMerge}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <GitMerge className="w-4 h-4 mr-2" />
              Merge to Main
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};
