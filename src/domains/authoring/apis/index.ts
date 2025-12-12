import { authInstance } from "@/shared/lib/axios";
import type { CreateLessonFormData } from "../types/lesson-creation";

export const getLessons = async (folderId?: string | null) => {
  const params = folderId ? { folderId } : {};
  return authInstance.get("/lessons", { params });
};

export const getCategories = async (id?: string, name?: string) => {
  return authInstance.get("/category", {
    params: {
      id,
      search: name,
    },
  });
};

// Folder APIs
export const getFolderTree = async () => {
  return authInstance.get("/folders/tree");
};

export const createFolder = async (data: {
  name: string;
  color?: string;
  icon?: string;
  parentId?: string;
}) => {
  return authInstance.post("/folders", data);
};

// Lesson APIs
export const createLesson = async (data: CreateLessonFormData) => {
  return authInstance.post("/lessons", data);
};

export const getLessonById = async (lessonId: string) => {
  return authInstance.get(`/lessons/${lessonId}`);
};
