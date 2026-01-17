import { useEffect } from "react";
import { useFolderTree } from "../queries";
import { toast } from "sonner";
import { authInstance } from "@/shared/lib/axios";

/**
 * Hook to automatically initialize default folders if user has none
 * Should be called in the main layout/page where folder management is used
 */
export function useInitializeFolders() {
  const { data: folderTree, isLoading, refetch } = useFolderTree();

  useEffect(() => {
    const initializeFolders = async () => {
      // Debug: Log the response to see what we're getting
      console.log("Folder tree data:", folderTree);
      console.log("Is loading:", isLoading);

      // Only initialize if:
      // 1. Not loading
      // 2. Data is loaded
      // 3. User has no folders
      if (!isLoading && folderTree && folderTree.folders.length === 0) {
        try {
          // Call backend to initialize default folders
          await authInstance.post("/folders/initialize");

          // Refresh folder tree
          await refetch();

          toast.success("Default folders created", {
            description:
              "Your workspace has been initialized with default folders",
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("Failed to initialize folders:", error);
          toast.error("Failed to create default folders", {
            description:
              error?.response?.data?.message || "Please try again later",
          });
        }
      }
    };

    initializeFolders();
  }, [isLoading, folderTree, refetch]);

  return { isLoading, hasInitialized: (folderTree?.folders.length ?? 0) > 0 };
}
