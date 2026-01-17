import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";
import { GitBranch, Plus, Check, Loader2, GitGraph } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  message?: string;
  isMain: boolean;
  status: string;
  createdAt: string;
  latestVersion?: {
    id: string;
    createdAt: string;
  } | null;
  versions?: Array<{
    id: string;
    createdAt: string;
    versionName?: string;
  }>;
}

interface BranchSelectorProps {
  currentBranch: Branch | null;
  branches: Branch[];
  isLoading: boolean;
  onBranchSelect: (branchId: string) => void;
  onCreateBranch: () => void;
  onVisualizeGraph?: () => void;
}

export const BranchSelector = ({
  currentBranch,
  branches,
  isLoading,
  onBranchSelect,
  onCreateBranch,
  onVisualizeGraph,
}: BranchSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleBranchSelect = (branchId: string) => {
    onBranchSelect(branchId);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <span className="truncate">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : currentBranch ? (
                currentBranch.name
              ) : (
                "Select branch"
              )}
            </span>
            {currentBranch?.isMain && (
              <Badge variant="secondary" className="text-xs">
                main
              </Badge>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Branches</DropdownMenuLabel>
          {onVisualizeGraph && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onVisualizeGraph();
              }}
            >
              <GitGraph className="h-3.5 w-3.5" />
              Visualize
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : branches.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No branches found
          </div>
        ) : (
          branches.map((branch) => (
            <DropdownMenuItem
              key={branch.id}
              onSelect={() => handleBranchSelect(branch.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <GitBranch className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{branch.name}</span>
                    {branch.isMain && (
                      <Badge variant="secondary" className="text-xs">
                        main
                      </Badge>
                    )}
                  </div>
                  {branch.message && (
                    <p className="text-xs text-muted-foreground truncate">
                      {branch.message}
                    </p>
                  )}
                </div>
              </div>
              {currentBranch?.id === branch.id && (
                <Check className="h-4 w-4 flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onCreateBranch();
            setOpen(false);
          }}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create new branch
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
