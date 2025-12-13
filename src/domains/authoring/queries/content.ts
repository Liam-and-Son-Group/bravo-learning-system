import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateLessonContent,
  getLessonContent,
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
