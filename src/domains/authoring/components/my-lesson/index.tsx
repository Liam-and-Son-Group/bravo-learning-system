/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/shared/components/ui/button";
import { DataTable } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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
import { useGetLessons, useCreateLessonMutation } from "../../queries";
import { useFolderTree } from "@/domains/folder/queries"; // Use folder domain
import { CreateLessonDialog } from "../create-lesson-dialog";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Folder, MoreHorizontal, Edit, Eye, Trash } from "lucide-react";
import type { CreateLessonFormData } from "../../types/lesson-creation";
import { useState } from "react";

// Helper function to flatten hierarchical folder tree
interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
}

function flattenFolders(
  folders: FolderNode[],
  level = 0
): { id: string; name: string }[] {
  const result: { id: string; name: string }[] = [];

  for (const folder of folders) {
    // Add indentation to show hierarchy
    const prefix = level > 0 ? "  ".repeat(level) + "└─ " : "";
    result.push({
      id: folder.id,
      name: prefix + folder.name,
    });

    // Recursively add children
    if (folder.children && folder.children.length > 0) {
      result.push(...flattenFolders(folder.children, level + 1));
    }
  }

  return result;
}

interface MyLessonsProps {
  selectedFolderId?: string | null;
}

export default function MyLessons({ selectedFolderId }: MyLessonsProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<any>(null);

  const handleEdit = (lessonId: string) => {
    if (!lessonId) {
      toast.error("Invalid lesson ID");
      return;
    }
    navigate({
      to: "/authoring/compose/$lessonId",
      params: { lessonId },
    });
  };

  const handleView = () => {
    // TODO: Implement view functionality
    toast.info("View functionality not yet implemented");
  };

  const handleDeleteClick = (lesson: any) => {
    setLessonToDelete(lesson);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (lessonToDelete) {
      // TODO: Call delete API
      toast.success(`Lesson "${lessonToDelete.name}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setLessonToDelete(null);
    }
  };

  const columns = [
    {
      key: "name" as const,
      header: "Lesson Title",
      render: (value: any) => value || "Untitled Lesson",
    },
    {
      key: "category" as const,
      header: "Category",
      render: (value: any) => value?.name || "Uncategorized",
    },
    {
      key: "mainWorkingDesk" as const,
      header: "Status",
      render: (value: any) => {
        const status = value?.status || "DRAFT";
        return (
          <Badge
            variant={status === "PUBLISHED" ? "default" : "secondary"}
            className="capitalize"
          >
            {status.toLowerCase()}
          </Badge>
        );
      },
    },
    {
      key: "createdAt" as const,
      header: "Created At",
      render: (value: any) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      key: "updatedAt" as const,
      header: "Updated At",
      render: (value: any) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      key: "id" as const,
      header: "Actions",
      render: (_: any, row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleView}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(row)}
              className="text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const { data: folderTreeData, isLoading: loadingFolders } = useFolderTree();
  const createLessonMutation = useCreateLessonMutation();

  // Fetch lessons filtered by folderId (user is from JWT token)
  const { data: lessonsData, isLoading: loadingLessons } =
    useGetLessons(selectedFolderId);

  // Flatten the hierarchical folder tree for the dropdown
  // The API returns { folders: [...] } directly
  const folderTree = folderTreeData?.folders || [];
  const folders = flattenFolders(folderTree);

  // Extract lessons from API response - try multiple possible structures
  const lessons = lessonsData?.data?.body || lessonsData?.data || [];

  // Find the selected folder name for display
  const findFolderById = (
    folders: FolderNode[],
    id: string
  ): FolderNode | null => {
    for (const folder of folders) {
      if (folder.id === id) return folder;
      if (folder.children) {
        const found = findFolderById(folder.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedFolder = selectedFolderId
    ? findFolderById(folderTree, selectedFolderId)
    : null;

  const handleLessonCreated = (lessonData: CreateLessonFormData) => {
    // Debug: Check if token exists
    const token = localStorage.getItem("access_token");
    console.log("🔐 Access token exists:", !!token);
    console.log("📤 Creating lesson with data:", lessonData);

    createLessonMutation.mutate(lessonData, {
      onSuccess: (response) => {
        const lessonId = response.data.body.id;
        toast.success("Lesson created successfully!");
        navigate({
          to: "/authoring/compose/$lessonId",
          params: { lessonId },
        });
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to create lesson"
        );
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {selectedFolder ? selectedFolder.name : "All Lessons"}
          </h1>
          {selectedFolder && (
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Folder className="h-4 w-4" />
              <span>Viewing lessons in this folder</span>
              <Badge variant="secondary">{selectedFolder.name}</Badge>
            </div>
          )}
        </div>
        <CreateLessonDialog folders={folders} onCreated={handleLessonCreated}>
          <Button disabled={loadingFolders || createLessonMutation.isPending}>
            {createLessonMutation.isPending
              ? "Creating..."
              : "Create new lesson"}
          </Button>
        </CreateLessonDialog>
      </div>
      <div className="mt-5">
        {loadingLessons ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading lessons...
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {selectedFolderId
              ? "No lessons in this folder yet"
              : "No lessons yet. Create your first lesson!"}
          </div>
        ) : (
          <DataTable columns={columns} data={lessons} />
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{lessonToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
