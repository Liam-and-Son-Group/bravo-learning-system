import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getLessons,
  getFolderTree,
  createFolder,
  createLesson,
  getLessonById,
  getLessonVersionGraph,
  deleteWorkingDesk,
  mergeBranch,
} from "../apis";
import type { CreateLessonFormData } from "../types/lesson-creation";

type TGetCategoryParams = {
  id?: string;
  search?: string;
};

export const LESSON_QUERY_KEY_NAME = "lesson";
export const CATEGORY_QUERY_KEY_NAME = "category";
export const FOLDER_QUERY_KEY_NAME = "folder";

export const useGetLessons = (folderId?: string | null) => {
  return useQuery({
    queryKey: [LESSON_QUERY_KEY_NAME, { folderId }],
    queryFn: () => getLessons(folderId),
  });
};

export const useGetCategories = ({ id, search }: TGetCategoryParams) => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY_NAME, id, search],
    queryFn: () => getCategories(id, search),
  });
};

// Folder queries
export const useGetFolderTree = () => {
  return useQuery({
    queryKey: [FOLDER_QUERY_KEY_NAME, "tree"],
    queryFn: getFolderTree,
  });
};

export const useCreateFolderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOLDER_QUERY_KEY_NAME] });
    },
  });
};

// Lesson queries
export const useCreateLessonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonFormData) => createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LESSON_QUERY_KEY_NAME] });
    },
  });
};

export const useGetLessonById = (lessonId: string) => {
  return useQuery({
    queryKey: [LESSON_QUERY_KEY_NAME, lessonId],
    queryFn: () => getLessonById(lessonId),
    enabled: !!lessonId,
  });
};

export const useGetLessonVersionGraph = (lessonId: string) => {
  return useQuery({
    queryKey: ["version-graph", lessonId],
    queryFn: () => getLessonVersionGraph(lessonId),
    enabled: !!lessonId,
  });
};

export const useDeleteWorkingDeskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkingDesk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["version-graph"] });
      queryClient.invalidateQueries({ queryKey: [LESSON_QUERY_KEY_NAME] });
    },
  });
};

export const useMergeBranchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      sourceBranchId,
      targetBranchId,
    }: {
      lessonId: string;
      sourceBranchId: string;
      targetBranchId?: string;
    }) => mergeBranch(lessonId, sourceBranchId, targetBranchId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["version-graph", variables.lessonId],
      });
      queryClient.invalidateQueries({
        queryKey: ["branches", variables.lessonId],
      });
      queryClient.invalidateQueries({
        queryKey: [LESSON_QUERY_KEY_NAME, variables.lessonId],
      });
    },
  });
};
