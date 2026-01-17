/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFolderTree,
  createFolder,
  updateFolder,
  moveFolder,
  deleteFolder,
  type CreateFolderDto,
  type UpdateFolderDto,
  type MoveFolderDto,
} from "../apis";
import { toast } from "sonner";

export const FOLDER_QUERY_KEY = "folders";

// Get folder tree
export const useFolderTree = () => {
  return useQuery({
    queryKey: [FOLDER_QUERY_KEY, "tree"],
    queryFn: async () => {
      try {
        const result = await getFolderTree();
        console.log("Folder tree API response:", result);
        return result;
      } catch (error) {
        console.error("Failed to fetch folder tree:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create folder mutation
export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateFolderDto) => createFolder(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLDER_QUERY_KEY] });
      toast.success("Folder created successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to create folder", {
        description: error.response?.data?.message || "Please try again",
      });
    },
  });
};

// Update folder mutation
export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateFolderDto }) =>
      updateFolder(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLDER_QUERY_KEY] });
      toast.success("Folder updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update folder", {
        description: error.response?.data?.message || "Please try again",
      });
    },
  });
};

// Move folder mutation
export const useMoveFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: MoveFolderDto }) =>
      moveFolder(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLDER_QUERY_KEY] });
      toast.success("Folder moved successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to move folder", {
        description: error.response?.data?.message || "Please try again",
      });
    },
  });
};

// Delete folder mutation
export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLDER_QUERY_KEY] });
      toast.success("Folder deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to delete folder", {
        description:
          error.response?.data?.message || "Folder must be empty to be deleted",
      });
    },
  });
};
