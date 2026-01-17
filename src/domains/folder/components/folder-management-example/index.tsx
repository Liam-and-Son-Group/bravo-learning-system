import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  FolderTree,
  CreateFolderDialog,
  useInitializeFolders,
  useFolderTree,
  type FolderTreeNode,
} from "@/domains/folder";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

/**
 * Example page showing how to integrate folder management
 * This can be added to the authoring page sidebar
 */
export function FolderManagementExample() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderTreeNode | null>(
    null
  );
  const [parentIdForCreate, setParentIdForCreate] = useState<
    string | undefined
  >(undefined);

  // Initialize default folders if user has none
  const { isLoading: isInitializing } = useInitializeFolders();

  // Fetch folder tree
  const { data: folderTree, isLoading: isLoadingTree } = useFolderTree();

  const handleCreateFolder = (parentId?: string) => {
    setParentIdForCreate(parentId);
    setCreateDialogOpen(true);
  };

  const handleFolderSelect = (folder: FolderTreeNode) => {
    setSelectedFolder(folder);
    console.log("Selected folder:", folder);
  };

  const handleEdit = (folder: FolderTreeNode) => {
    // TODO: Open edit dialog with folder data
    console.log("Edit folder:", folder);
  };

  const isLoading = isInitializing || isLoadingTree;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Folders</CardTitle>
          <Button
            size="sm"
            onClick={() => handleCreateFolder()}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <FolderTree
              folders={folderTree?.folders || []}
              selectedId={selectedFolder?.id || null}
              onSelect={handleFolderSelect}
              onCreateSubfolder={handleCreateFolder}
              onEdit={handleEdit}
            />

            {selectedFolder && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Selected Folder:</p>
                <p className="text-sm text-muted-foreground">
                  {selectedFolder.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedFolder.lessonCount} lesson(s)
                </p>
              </div>
            )}
          </>
        )}

        <CreateFolderDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          parentId={parentIdForCreate}
        />
      </CardContent>
    </Card>
  );
}
