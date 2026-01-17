import { useEffect, useRef, useState } from "react";
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
  Loader2,
  Calendar,
  GitMerge,
} from "lucide-react";
import { useMergeBranchMutation } from "../../queries/content";
import { toast } from "sonner";

interface BranchVersion {
  id: string;
  createdAt: string;
  versionName?: string;
  authorName?: string;
  authorEmail?: string;
  authorAvatar?: string;
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
  lessonId: string;
}

interface VersionPoint {
  versionId: string;
  branchId: string;
  x: number;
  y: number;
  version: BranchVersion;
  branchName: string;
}

interface MergePoint {
  x: number;
  y: number;
  branchId: string;
  branchName: string;
  versions: BranchVersion[];
}

export const BranchGraphModal = ({
  open,
  onOpenChange,
  branches,
  currentBranchId,
  lessonId,
}: BranchGraphModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
  const [isCanvasLoading, setIsCanvasLoading] = useState(false);
  const hasInitiallyRendered = useRef(false);
  const [hoveredVersion, setHoveredVersion] = useState<VersionPoint | null>(
    null
  );
  const [hoveredMergePoint, setHoveredMergePoint] = useState<MergePoint | null>(
    null
  );
  const [versionPoints, setVersionPoints] = useState<VersionPoint[]>([]);
  const [mergePoints, setMergePoints] = useState<MergePoint[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  const mergeBranchMutation = useMergeBranchMutation(lessonId);

  // Debug: Log branches data and reset loading state when modal opens/closes
  useEffect(() => {
    if (open && branches) {
      console.log("Branch Graph Modal - Branches:", branches);
      branches.forEach((branch) => {
        console.log(`Branch ${branch.name}:`, {
          versions: branch.versions?.length || 0,
          latestVersion: branch.latestVersion,
        });
      });
      // Set loading to true only when modal first opens
      if (!hasInitiallyRendered.current) {
        setIsCanvasLoading(true);
      }
    }
    if (!open) {
      setIsCanvasLoading(false);
      hasInitiallyRendered.current = false;
    }
  }, [open, branches]);

  useEffect(() => {
    if (!open || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsCanvasLoading(false);
      hasInitiallyRendered.current = true;
      return;
    }



    // Wait for the canvas to be rendered with proper dimensions
    const drawGraph = () => {
      try {
        // Sort branches: main first, then by creation date
        const sortedBranches = [...branches].sort((a, b) => {
          if (a.isMain) return -1;
          if (b.isMain) return 1;
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

        const laneWidth = 120; // Width of each branch lane (horizontal spacing)
        const commitSpacing = 60; // Vertical spacing between commits
        const startX = 60; // Left padding
        const topPadding = 60; // Top padding for branch labels
        const bottomPadding = 60; // Bottom padding for branch labels

        // Calculate maximum number of versions across all branches
        const maxVersions = Math.max(
          ...sortedBranches.map(
            (branch) =>
              branch.versions?.length || (branch.latestVersion ? 1 : 0)
          ),
          1
        );

        // Calculate canvas dimensions - horizontal lanes, vertical commits
        const width = startX + sortedBranches.length * laneWidth + 200; // Width for lanes + labels
        const height = topPadding + maxVersions * commitSpacing + bottomPadding;

        // Reset transform before setting size
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Set canvas size
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Store version points and merge points for hover detection
        const points: VersionPoint[] = [];
        const merges: MergePoint[] = [];

        // Branch colors (GitHub-like)
        const branchColors = [
          "#2ea44f", // Green for main
          "#0969da", // Blue
          "#8250df", // Purple
          "#bf3989", // Pink
          "#fb8500", // Orange
          "#1f6feb", // Light blue
        ];

        // First pass: collect all version positions and assign lanes
        const versionPositions = new Map<
          string,
          { x: number; y: number; lane: number }
        >();
        const branchLanes = new Map<string, number>();
        const mergedBranchData = new Map<string, { mergeY: number }>();

        sortedBranches.forEach((branch, branchIndex) => {
          branchLanes.set(branch.id, branchIndex);
          const laneX = startX + branchIndex * laneWidth;
          let versions =
            branch.versions ||
            (branch.latestVersion ? [branch.latestVersion] : []);

          // For feature branches, exclude the branched-from version (it belongs to parent branch)
          if (!branch.isMain && branch.branchedFromVersionId) {
            versions = versions.filter(
              (v) => v.id !== branch.branchedFromVersionId
            );
          }

          // Reverse to show oldest to newest (bottom to top)
          const orderedVersions = [...versions].reverse();

          orderedVersions.forEach((version, versionIndex) => {
            // Calculate Y from bottom up: newer commits have smaller Y (higher up)
            const commitY =
              height - bottomPadding - versionIndex * commitSpacing;
            versionPositions.set(version.id, {
              x: laneX,
              y: commitY,
              lane: branchIndex,
            });
          });

          // Track merge points for main branch extension
          if (
            !branch.isMain &&
            branch.status.toLowerCase() === "merged" &&
            orderedVersions.length > 0
          ) {
            const mainBranch = sortedBranches.find((b) => b.isMain);
            if (mainBranch) {
              const mainVersions = mainBranch.versions || [];
              // Merge point should be one commit spacing higher (lower Y value) than the next main branch commit
              const mergeY =
                height -
                bottomPadding -
                (mainVersions.length + 1) * commitSpacing;
              mergedBranchData.set(branch.id, { mergeY });
            }
          }
        });

        // Draw branches and versions (GitHub style - vertical)
        sortedBranches.forEach((branch, branchIndex) => {
          const laneX = startX + branchIndex * laneWidth;
          const isHovered = hoveredBranch === branch.id;
          const isCurrent = currentBranchId === branch.id;
          const branchColor = branchColors[branchIndex % branchColors.length];

          let versions =
            branch.versions ||
            (branch.latestVersion ? [branch.latestVersion] : []);

          // For feature branches, exclude the branched-from version (it belongs to parent branch)
          if (!branch.isMain && branch.branchedFromVersionId) {
            versions = versions.filter(
              (v) => v.id !== branch.branchedFromVersionId
            );
          }

          // Reverse to show oldest to newest (bottom to top)
          const orderedVersions = [...versions].reverse();

          // Calculate the extent of the main branch line (including merge points)
          // Start from bottom (root) and extend upward (to lower Y values)
          let minY =
            height -
            bottomPadding -
            (orderedVersions.length - 1) * commitSpacing;
          if (branch.isMain) {
            // Find all merge points for this branch
            sortedBranches.forEach((otherBranch) => {
              if (
                !otherBranch.isMain &&
                otherBranch.status.toLowerCase() === "merged"
              ) {
                const mergeData = mergedBranchData.get(otherBranch.id);
                if (mergeData && mergeData.mergeY < minY) {
                  minY = mergeData.mergeY;
                }
              }
            });
          }

          // Calculate start position for feature branches
          let branchStartY = height - bottomPadding; // Root at bottom by default

          // For feature branches, start from the branched point
          if (!branch.isMain && branch.branchedFromVersionId) {
            const parentPosition = versionPositions.get(
              branch.branchedFromVersionId
            );
            if (parentPosition) {
              branchStartY = parentPosition.y; // Start from checkout point
            }
          }

          // Draw connecting line through all commits (and to merge points for main branch)
          if (
            orderedVersions.length > 0 ||
            (branch.isMain && minY < branchStartY)
          ) {
            ctx.strokeStyle = isHovered ? "#0969da" : branchColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(laneX, branchStartY);
            ctx.lineTo(laneX, minY);
            ctx.stroke();
          }

          // Draw branching connection if this is a feature branch
          if (
            !branch.isMain &&
            branch.branchedFromVersionId &&
            orderedVersions.length > 0
          ) {
            const parentPosition = versionPositions.get(
              branch.branchedFromVersionId
            );
            if (parentPosition) {
              const firstCommitY = branchStartY; // Draw smooth curve from parent to branch start
              ctx.strokeStyle = branchColor;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(parentPosition.x, parentPosition.y);

              // Bezier curve for smooth transition
              const controlY = (parentPosition.y + firstCommitY) / 2;
              ctx.bezierCurveTo(
                parentPosition.x,
                controlY,
                laneX,
                controlY,
                laneX,
                firstCommitY
              );
              ctx.stroke();

              // Draw checkout point indicator on parent branch
              // Draw a prominent ring around the checkout point
              ctx.strokeStyle = branchColor;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(parentPosition.x, parentPosition.y, 18, 0, Math.PI * 2);
              ctx.stroke();

              // Draw a second ring for emphasis
              ctx.strokeStyle = branchColor;
              ctx.lineWidth = 1.5;
              ctx.setLineDash([3, 2]);
              ctx.beginPath();
              ctx.arc(parentPosition.x, parentPosition.y, 22, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([]); // Reset to solid line

              // Draw label "Branched" next to the checkout point
              ctx.fillStyle = branchColor;
              ctx.font = "bold 9px system-ui";
              ctx.textAlign = "left";
              ctx.textBaseline = "middle";

              // Position label to the right of the checkout point
              const labelX = parentPosition.x + 28;
              const labelY = parentPosition.y;

              // Draw background for label
              const labelText = "Branched";
              const labelWidth = ctx.measureText(labelText).width;
              ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
              ctx.fillRect(labelX - 2, labelY - 7, labelWidth + 4, 14);

              // Draw label text
              ctx.fillStyle = branchColor;
              ctx.fillText(labelText, labelX, labelY);

              ctx.textAlign = "start";
              ctx.textBaseline = "alphabetic";
            }
          } // Draw merge connection if this branch was merged
          if (!branch.isMain && branch.status.toLowerCase() === "merged") {
            if (orderedVersions.length > 0) {
              const lastCommitY =
                height -
                bottomPadding -
                (orderedVersions.length - 1) * commitSpacing;

              // Find main branch
              const mainBranch = sortedBranches.find((b) => b.isMain);
              if (mainBranch) {
                const mainLane = branchLanes.get(mainBranch.id);
                if (mainLane !== undefined) {
                  const mainLaneX = startX + mainLane * laneWidth;
                  const mainVersions = mainBranch.versions || [];
                  // Merge point positioned as the latest version on main branch (top)
                  const mergeTargetY =
                    height -
                    bottomPadding -
                    mainVersions.length * commitSpacing;

                  // Get the latest version from the merged branch for avatar display
                  const latestMergedVersion =
                    orderedVersions[orderedVersions.length - 1];

                  // Draw smooth merge curve with dashed line
                  ctx.strokeStyle = "#2ea44f"; // Green for merge
                  ctx.lineWidth = 2;
                  ctx.setLineDash([5, 3]);
                  ctx.beginPath();
                  ctx.moveTo(laneX, lastCommitY);

                  const controlY = (lastCommitY + mergeTargetY) / 2;
                  ctx.bezierCurveTo(
                    laneX,
                    controlY,
                    mainLaneX,
                    controlY,
                    mainLaneX,
                    mergeTargetY
                  );
                  ctx.stroke();
                  ctx.setLineDash([]); // Reset to solid line

                  // Draw merge point as avatar circle (like regular commits)
                  const avatarRadius = 12;

                  // Draw avatar circle background
                  ctx.fillStyle = "#2ea44f"; // Green for merge
                  ctx.beginPath();
                  ctx.arc(
                    mainLaneX,
                    mergeTargetY,
                    avatarRadius,
                    0,
                    Math.PI * 2
                  );
                  ctx.fill();

                  // Draw avatar ring (outer border)
                  ctx.strokeStyle = "#2ea44f";
                  ctx.lineWidth = 2;
                  ctx.beginPath();
                  ctx.arc(
                    mainLaneX,
                    mergeTargetY,
                    avatarRadius,
                    0,
                    Math.PI * 2
                  );
                  ctx.stroke();

                  // Draw user initials from the latest version of merged branch
                  ctx.fillStyle = "#ffffff";
                  ctx.font = "bold 10px system-ui";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";

                  let displayText = "M"; // Default to "M" for Merge
                  if (latestMergedVersion.authorName) {
                    const nameParts = latestMergedVersion.authorName
                      .trim()
                      .split(/\s+/);
                    if (nameParts.length >= 2) {
                      displayText = (
                        nameParts[0][0] + nameParts[nameParts.length - 1][0]
                      ).toUpperCase();
                    } else if (
                      nameParts.length === 1 &&
                      nameParts[0].length > 0
                    ) {
                      displayText = nameParts[0][0].toUpperCase();
                    }
                  } else if (latestMergedVersion.authorEmail) {
                    displayText =
                      latestMergedVersion.authorEmail[0].toUpperCase();
                  }

                  ctx.fillText(displayText, mainLaneX, mergeTargetY);
                  ctx.textAlign = "start";
                  ctx.textBaseline = "alphabetic";

                  // Store merge point for hover detection
                  merges.push({
                    x: mainLaneX,
                    y: mergeTargetY,
                    branchId: branch.id,
                    branchName: branch.name,
                    versions: versions,
                  });

                  // Store as a version point too for consistency
                  points.push({
                    versionId: `merge-${branch.id}`,
                    branchId: mainBranch.id,
                    x: mainLaneX,
                    y: mergeTargetY,
                    version: latestMergedVersion,
                    branchName: `${branch.name} (merged)`,
                  });
                }
              }
            }
          } // Draw commits as dots with avatars
          orderedVersions.forEach((version, versionIndex) => {
            const commitY =
              height - bottomPadding - versionIndex * commitSpacing;

            // Store version point position for hover detection
            points.push({
              versionId: version.id,
              branchId: branch.id,
              x: laneX,
              y: commitY,
              version,
              branchName: branch.name,
            });

            // Draw avatar circle background
            const avatarRadius = 12;
            const isLatestOfCurrentBranch =
              isCurrent && versionIndex === orderedVersions.length - 1;

            ctx.fillStyle = isLatestOfCurrentBranch
              ? "#2ea44f" // Green for current latest (at top)
              : branchColor;
            ctx.beginPath();
            ctx.arc(laneX, commitY, avatarRadius, 0, Math.PI * 2);
            ctx.fill();

            // Draw blinking wave effect for latest version of current branch
            if (isLatestOfCurrentBranch) {
              const waveProgress = (animationFrame % 60) / 60; // 0 to 1 cycle
              const waveRadius = avatarRadius + 4 + waveProgress * 8;
              const waveOpacity = 1 - waveProgress;

              // Draw multiple wave rings for more prominent effect
              ctx.strokeStyle = `rgba(46, 164, 79, ${waveOpacity})`;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(laneX, commitY, waveRadius, 0, Math.PI * 2);
              ctx.stroke();

              // Second wave with slight delay
              const waveProgress2 = ((animationFrame + 15) % 60) / 60;
              const waveRadius2 = avatarRadius + 4 + waveProgress2 * 8;
              const waveOpacity2 = (1 - waveProgress2) * 0.6;

              ctx.strokeStyle = `rgba(46, 164, 79, ${waveOpacity2})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(laneX, commitY, waveRadius2, 0, Math.PI * 2);
              ctx.stroke();

              // Draw "CURRENT" label below the commit
              ctx.fillStyle = "#2ea44f";
              ctx.font = "bold 9px system-ui";
              ctx.textAlign = "center";
              ctx.textBaseline = "top";

              const labelY = commitY + avatarRadius + 8;
              const labelText = "CURRENT";
              const labelWidth = ctx.measureText(labelText).width;

              // Draw background for label
              ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
              ctx.fillRect(
                laneX - labelWidth / 2 - 3,
                labelY - 2,
                labelWidth + 6,
                12
              );

              // Draw border around label
              ctx.strokeStyle = "#2ea44f";
              ctx.lineWidth = 1;
              ctx.strokeRect(
                laneX - labelWidth / 2 - 3,
                labelY - 2,
                labelWidth + 6,
                12
              );

              // Draw label text
              ctx.fillStyle = "#2ea44f";
              ctx.fillText(labelText, laneX, labelY);

              ctx.textAlign = "start";
              ctx.textBaseline = "alphabetic";
            }

            // Draw avatar ring (outer border)
            ctx.strokeStyle = isHovered ? "#0969da" : branchColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(laneX, commitY, avatarRadius, 0, Math.PI * 2);
            ctx.stroke();

            // Draw user initials or avatar inside circle
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 10px system-ui";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Get user initials from version data
            let displayText = "?";
            if (version.authorName) {
              // Extract initials from author name (e.g., "John Doe" -> "JD")
              const nameParts = version.authorName.trim().split(/\s+/);
              if (nameParts.length >= 2) {
                displayText = (
                  nameParts[0][0] + nameParts[nameParts.length - 1][0]
                ).toUpperCase();
              } else if (nameParts.length === 1 && nameParts[0].length > 0) {
                displayText = nameParts[0][0].toUpperCase();
              }
            } else if (version.authorEmail) {
              // Use first letter of email if name not available
              displayText = version.authorEmail[0].toUpperCase();
            }

            ctx.fillText(displayText, laneX, commitY);
            ctx.textAlign = "start"; // Reset to default
            ctx.textBaseline = "alphabetic"; // Reset to default
          });

          // Draw branch name label at the top of branch
          const labelY = minY - 15; // Position above the highest commit
          ctx.fillStyle = "#24292f";
          ctx.font = "bold 12px system-ui";

          // Calculate text width to center it above the lane
          const branchNameWidth = ctx.measureText(branch.name).width;
          const textX = laneX - branchNameWidth / 2;
          ctx.fillText(branch.name, textX, labelY);

          // Draw main badge
          if (branch.isMain) {
            ctx.fillStyle = "#2ea44f";
            ctx.font = "10px system-ui";
            const badgeX = textX + branchNameWidth + 5;
            ctx.fillText("MAIN", badgeX, labelY);
          }
        });

        // Save version points and merge points for hover detection
        setVersionPoints(points);
        setMergePoints(merges);

        // Mark loading as complete after initial drawing
        if (!hasInitiallyRendered.current) {
          setIsCanvasLoading(false);
          hasInitiallyRendered.current = true;
        }
      } catch (error) {
        console.error("Error drawing branch graph:", error);
        setIsCanvasLoading(false);
        hasInitiallyRendered.current = true;
      }
    };

    // Use requestAnimationFrame to ensure DOM is fully rendered
    const rafId = requestAnimationFrame(() => {
      drawGraph();
    });

    // Set up ResizeObserver to redraw when canvas is resized
    const resizeObserver = new ResizeObserver(() => {
      drawGraph();
    });

    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [open, branches, currentBranchId, hoveredBranch, animationFrame]);

  // Animation loop for blinking wave effect
  useEffect(() => {
    if (!open) return;

    let animationId: number;
    const animate = () => {
      setAnimationFrame((prev) => prev + 1);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [open]);

  // Handle mouse move over canvas to detect version point and merge point hover
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if mouse is over any merge point first (within 10px radius)
    const hoveredMerge = mergePoints.find((point) => {
      const distance = Math.sqrt(
        Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
      );
      return distance <= 10;
    });

    if (hoveredMerge) {
      setHoveredMergePoint(hoveredMerge);
      setHoveredVersion(null);
      canvas.style.cursor = "pointer";
      return;
    }

    // Check if mouse is over any version point (within 10px radius)
    const hoveredPoint = versionPoints.find((point) => {
      const distance = Math.sqrt(
        Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
      );
      return distance <= 10;
    });

    setHoveredVersion(hoveredPoint || null);
    setHoveredMergePoint(null);

    // Change cursor when hovering over a version point
    canvas.style.cursor = hoveredPoint ? "pointer" : "default";
  };

  const handleCanvasMouseLeave = () => {
    setHoveredVersion(null);
    setHoveredMergePoint(null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "default";
    }
  };

  const handleMergeBranch = async (
    sourceBranchId: string,
    branchName: string
  ) => {
    try {
      await mergeBranchMutation.mutateAsync({
        sourceBranchId,
        // targetBranchId will default to main branch in backend
      });

      toast.success(`Branch merged successfully`, {
        description: `${branchName} has been merged into main branch`,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Merge failed", {
        description: error?.response?.data?.message || "Failed to merge branch",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Branch & Version History
          </DialogTitle>
          <DialogDescription>
            Visual representation of all branches and their version history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-auto">
          {/* Canvas for graph visualization */}
          <div className="border rounded-lg bg-white p-4 relative">
            <div
              ref={containerRef}
              className="relative max-w-full overflow-y-auto max-h-[500px]"
            >
              {isCanvasLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="w-full"
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseLeave}
              />

              {/* Version popover */}
              {hoveredVersion && (
                <div
                  className="absolute z-10 pointer-events-none"
                  style={{
                    left: hoveredVersion.x,
                    top: hoveredVersion.y + 20,
                    transform: "translateX(-50%)",
                  }}
                >
                  {/* Arrow pointing up */}
                  <div className="flex justify-center mb-1">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-200" />
                  </div>
                  <div className="bg-white border rounded-lg shadow-lg p-3 min-w-[250px] pointer-events-auto">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {hoveredVersion.version.versionName ? (
                            <p className="font-semibold text-sm truncate">
                              {hoveredVersion.version.versionName}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              No version name
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0"
                        >
                          {hoveredVersion.branchName}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(
                            hoveredVersion.version.createdAt
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <GitCommit className="h-3 w-3" />
                        <span className="font-mono text-xs truncate">
                          {hoveredVersion.versionId.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Merge point popover */}
              {hoveredMergePoint && (
                <div
                  className="absolute z-10 pointer-events-none"
                  style={{
                    left: hoveredMergePoint.x,
                    top: hoveredMergePoint.y + 20,
                    transform: "translateX(-50%)",
                  }}
                >
                  {/* Arrow pointing up */}
                  <div className="flex justify-center mb-1">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-green-200" />
                  </div>
                  <div className="bg-white border-2 border-green-500 rounded-lg shadow-lg p-3 min-w-[280px] max-w-[350px] pointer-events-auto">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <GitMerge className="h-4 w-4 text-green-600" />
                        <p className="font-semibold text-sm text-green-700">
                          Merged from: {hoveredMergePoint.branchName}
                        </p>
                      </div>

                      <div className="border-t pt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Versions merged ({hoveredMergePoint.versions.length}):
                        </p>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {hoveredMergePoint.versions.map((version, idx) => (
                            <div
                              key={version.id}
                              className="flex items-start gap-2 text-xs bg-green-50 p-2 rounded"
                            >
                              <GitCommit className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                {version.versionName ? (
                                  <p className="font-medium truncate">
                                    {version.versionName}
                                  </p>
                                ) : (
                                  <p className="text-muted-foreground italic">
                                    Version {idx + 1}
                                  </p>
                                )}
                                <p className="text-muted-foreground text-[10px]">
                                  {new Date(version.createdAt).toLocaleString()}
                                </p>
                              </div>
                              {idx === 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1 py-0 h-4 flex-shrink-0"
                                >
                                  latest
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Branch details list */}
          <div className="border rounded-lg p-4 space-y-4">
            {branches
              .sort((a, b) => {
                if (a.isMain) return -1;
                if (b.isMain) return 1;
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              })
              .map((branch) => (
                <div
                  key={branch.id}
                  className={`p-3 border rounded-lg transition-colors cursor-pointer ${
                    hoveredBranch === branch.id
                      ? "bg-blue-50 border-blue-300"
                      : currentBranchId === branch.id
                      ? "bg-green-50 border-green-300"
                      : "hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setHoveredBranch(branch.id)}
                  onMouseLeave={() => setHoveredBranch(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <GitBranch className="h-4 w-4 flex-shrink-0 text-purple-600" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{branch.name}</span>
                          {branch.isMain && (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-700"
                            >
                              main
                            </Badge>
                          )}
                          {currentBranchId === branch.id && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700"
                            >
                              current
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {branch.status.toLowerCase()}
                          </Badge>
                        </div>
                        {branch.message && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {branch.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(branch.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Merge button for feature branches */}
                    {!branch.isMain &&
                      branch.status.toLowerCase() !== "merged" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMergeBranch(branch.id, branch.name);
                          }}
                          disabled={mergeBranchMutation.isPending}
                        >
                          <GitMerge className="h-3 w-3 mr-1" />
                          Merge
                        </Button>
                      )}
                  </div>

                  {/* Version history */}
                  {branch.versions && branch.versions.length > 0 ? (
                    <div className="mt-3 pl-6 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Versions ({branch.versions.length})
                      </p>
                      {branch.versions.map((version, idx) => (
                        <div
                          key={version.id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <GitCommit className="h-3 w-3 text-blue-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            {version.versionName && (
                              <p className="text-xs font-medium truncate">
                                {version.versionName}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {new Date(version.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {idx === 0 && (
                            <Badge
                              variant="secondary"
                              className="text-xs flex-shrink-0"
                            >
                              latest
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : branch.latestVersion ? (
                    <div className="mt-3 pl-6">
                      <div className="flex items-center gap-2 text-sm">
                        <GitCommit className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            branch.latestVersion.createdAt
                          ).toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          latest
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-2 pl-6">
                      No versions yet
                    </p>
                  )}
                </div>
              ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Main Branch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Feature Branch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Version</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Current Branch</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
