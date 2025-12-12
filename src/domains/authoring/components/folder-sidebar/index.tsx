import { useState } from "react";
import { Plus, Folder as FolderIcon, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useFolderTree } from "@/domains/folder/queries"; // Use folder domain query
import { CreateFolderDialog } from "@/domains/folder/components/create-folder-dialog";
import { FolderTree } from "@/domains/folder/components/folder-tree";
import type { FolderTreeNode } from "@/domains/folder/apis";
import { useInitializeFolders } from "@/domains/folder/hooks/use-initialize-folders";

interface FolderSidebarProps {
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

export function FolderSidebar({
  selectedFolderId,
  onFolderSelect,
}: FolderSidebarProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [parentIdForCreate, setParentIdForCreate] = useState<
    string | undefined
  >(undefined);

  // Auto-initialize default folders if user has none
  const { isLoading: isInitializing } = useInitializeFolders();

  // Fetch folder tree - use the same hook from folder domain
  const { data: folderTreeData, isLoading: isLoadingTree } = useFolderTree();

  const handleCreateFolder = (parentId?: string) => {
    setParentIdForCreate(parentId);
    setCreateDialogOpen(true);
  };

  const handleFolderSelect = (folder: FolderTreeNode) => {
    onFolderSelect(folder.id);
  };

  const handleEditFolder = (folder: FolderTreeNode) => {
    // TODO: Open edit dialog with folder data
    console.log("Edit folder:", folder);
  };

  const isLoading = isInitializing || isLoadingTree;
  // The API returns { folders: [...] } directly
  const folders = folderTreeData?.folders || [];

  // Debug logging
  console.log("FolderSidebar - folderTreeData:", folderTreeData);
  console.log("FolderSidebar - folders:", folders);
  console.log("FolderSidebar - folders.length:", folders.length);
  console.log("FolderSidebar - isLoading:", isLoading);
  console.log("FolderSidebar - isInitializing:", isInitializing);
  console.log("FolderSidebar - isLoadingTree:", isLoadingTree);
  console.log("FolderSidebar - Condition check:", {
    isLoading,
    foldersLength: folders.length,
    willShowEmpty: !isLoading && folders.length === 0,
    willShowTree: !isLoading && folders.length > 0,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FolderIcon className="h-5 w-5" />
            Folders
          </h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleCreateFolder()}
            disabled={isLoading}
            title="Create new folder"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* "All Lessons" option */}
        <Button
          variant={selectedFolderId === null ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onFolderSelect(null)}
        >
          <FolderIcon className="h-4 w-4 mr-2" />
          All Lessons
        </Button>
      </div>

      {/* Folder Tree */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-2">
                No folders yet
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCreateFolder()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Folder
              </Button>
            </div>
          ) : (
            <FolderTree
              folders={folders}
              selectedId={selectedFolderId}
              onSelect={handleFolderSelect}
              onCreateSubfolder={handleCreateFolder}
              onEdit={handleEditFolder}
            />
          )}
        </div>
      </ScrollArea>

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        parentId={parentIdForCreate}
      />
    </div>
  );
}
