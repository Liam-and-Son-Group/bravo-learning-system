import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderPlus,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils/mergeClass";
import type { FolderTreeNode } from "../../apis";
import { useDeleteFolder } from "../../queries";
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

interface FolderTreeItemProps {
  folder: FolderTreeNode;
  level?: number;
  onSelect?: (folder: FolderTreeNode) => void;
  onCreateSubfolder?: (parentId: string) => void;
  onEdit?: (folder: FolderTreeNode) => void;
  selectedId?: string | null;
}

function FolderTreeItem({
  folder,
  level = 0,
  onSelect,
  onCreateSubfolder,
  onEdit,
  selectedId,
}: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteFolder, isPending: isDeleting } = useDeleteFolder();

  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedId === folder.id;

  const handleDelete = () => {
    deleteFolder(folder.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <div className="group">
        <div
          className={cn(
            "flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
            isSelected && "bg-accent"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 hover:bg-accent rounded-sm"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Folder Icon and Name */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0"
            onClick={() => onSelect?.(folder)}
          >
            <Folder
              className="h-4 w-4 flex-shrink-0"
              style={{ color: folder.color || "#3B82F6" }}
              fill={folder.color || "#3B82F6"}
            />
            <span className="text-sm font-medium truncate">{folder.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {folder.lessonCount}
            </span>
          </div>

          {/* Actions Menu */}
          {!folder.isSystem && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onCreateSubfolder?.(folder.id)}
                >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Subfolder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(folder)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div>
            {folder.children.map((child) => (
              <FolderTreeItem
                key={child.id}
                folder={child}
                level={level + 1}
                onSelect={onSelect}
                onCreateSubfolder={onCreateSubfolder}
                onEdit={onEdit}
                selectedId={selectedId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{folder.name}"? This action
              cannot be undone. The folder must be empty to be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface FolderTreeProps {
  folders: FolderTreeNode[];
  onSelect?: (folder: FolderTreeNode) => void;
  onCreateSubfolder?: (parentId: string) => void;
  onEdit?: (folder: FolderTreeNode) => void;
  selectedId?: string | null;
}

export function FolderTree({
  folders,
  onSelect,
  onCreateSubfolder,
  onEdit,
  selectedId,
}: FolderTreeProps) {
  if (folders.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No folders yet. Create your first folder to get started.
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {folders.map((folder) => (
        <FolderTreeItem
          key={folder.id}
          folder={folder}
          onSelect={onSelect}
          onCreateSubfolder={onCreateSubfolder}
          onEdit={onEdit}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
}
