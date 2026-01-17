import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateLessonContent,
  getLessonContent,
  saveLessonVersion,
  getBranches,
  createBranch,
  getBranchContent,
  getBranchVersionHistory,
  getVersionDetails,
  mergeBranch,
  publishLesson,
  unpublishLesson,
  deleteLesson,
} from "../apis";
import type { ContentBlock } from "../components/lexical-editor";

export const LESSON_CONTENT_QUERY_KEY = "lesson-content";

// Get lesson content
export const useGetLessonContent = (lessonId: string) => {
  return useQuery({
    queryKey: [LESSON_CONTENT_QUERY_KEY, lessonId],
    queryFn: () => getLessonContent(lessonId),
    enabled: !!lessonId,
  });
};

// Update lesson content mutation
export const useUpdateLessonContentMutation = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: { blocks: ContentBlock[]; updatedAt: number }) =>
      updateLessonContent(lessonId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LESSON_CONTENT_QUERY_KEY, lessonId],
      });
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
    },
  });
};

// Save lesson version mutation
export const useSaveLessonVersionMutation = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      branchId: string;
      versionName: string;
      blocks: ContentBlock[];
    }) => saveLessonVersion(lessonId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [LESSON_CONTENT_QUERY_KEY, lessonId],
      });
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["branches", lessonId] });
      queryClient.invalidateQueries({
        queryKey: ["branch-content", lessonId, variables.branchId],
      });
    },
  });
};

// Get branches for a lesson
export const useGetBranches = (lessonId: string) => {
  return useQuery({
    queryKey: ["branches", lessonId],
    queryFn: () => getBranches(lessonId),
    enabled: !!lessonId,
  });
};

// Create branch mutation
export const useCreateBranchMutation = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      message?: string;
      sourceBranchId?: string;
    }) => createBranch(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", lessonId] });
    },
  });
};

// Get branch content
export const useGetBranchContent = (
  lessonId: string,
  branchId: string | null
) => {
  return useQuery({
    queryKey: ["branch-content", lessonId, branchId],
    queryFn: () => getBranchContent(lessonId, branchId!),
    enabled: !!lessonId && !!branchId,
  });
};

// Get branch version history
export const useGetBranchVersionHistory = (
  lessonId: string,
  branchId: string | null
) => {
  return useQuery({
    queryKey: ["branch-version-history", lessonId, branchId],
    queryFn: () => getBranchVersionHistory(lessonId, branchId!),
    enabled: !!lessonId && !!branchId,
  });
};

// Get version details
export const useGetVersionDetails = (
  lessonId: string,
  versionId: string | null
) => {
  return useQuery({
    queryKey: ["version-details", lessonId, versionId],
    queryFn: () => getVersionDetails(lessonId, versionId!),
    enabled: !!lessonId && !!versionId,
  });
};

// Publish lesson mutation
export const usePublishLessonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishLesson,
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

// Unpublish lesson mutation
export const useUnpublishLessonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unpublishLesson,
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

// Merge branch mutation
export const useMergeBranchMutation = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sourceBranchId,
      targetBranchId,
    }: {
      sourceBranchId: string;
      targetBranchId?: string;
    }) => mergeBranch(lessonId, sourceBranchId, targetBranchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({
        queryKey: [LESSON_CONTENT_QUERY_KEY, lessonId],
      });
    },
  });
};

// Delete lesson mutation
export const useDeleteLessonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      permanent,
    }: {
      lessonId: string;
      permanent?: boolean;
    }) => deleteLesson(lessonId, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};
