import { authInstance } from "@/shared/lib/axios";
import type { CreateLessonFormData } from "../types/lesson-creation";
import type { ContentBlock } from "../components/lexical-editor";

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

// Lesson Content APIs
export const updateLessonContent = async (
  lessonId: string,
  content: {
    blocks: ContentBlock[];
    updatedAt: number;
  },
) => {
  return authInstance.patch(`/lessons/${lessonId}/content`, content);
};

export const getLessonContent = async (lessonId: string) => {
  return authInstance.get(`/lessons/${lessonId}/content`);
};

export const saveLessonVersion = async (
  lessonId: string,
  data: {
    branchId: string;
    versionName: string;
    blocks: ContentBlock[];
  },
) => {
  return authInstance.post(`/lessons/${lessonId}/versions`, data);
};

// Branch APIs
export const getBranches = async (lessonId: string) => {
  return authInstance.get(`/lessons/${lessonId}/branches`);
};

export const createBranch = async (
  lessonId: string,
  data: {
    name: string;
    message?: string;
    sourceBranchId?: string;
  },
) => {
  return authInstance.post(`/lessons/${lessonId}/branches`, data);
};

export const getBranchContent = async (lessonId: string, branchId: string) => {
  return authInstance.get(`/lessons/${lessonId}/branches/${branchId}/content`);
};

export const getBranchVersionHistory = async (
  lessonId: string,
  branchId: string,
) => {
  return authInstance.get(`/lessons/${lessonId}/branches/${branchId}/versions`);
};

export const getVersionDetails = async (
  lessonId: string,
  versionId: string,
) => {
  return authInstance.get(`/lessons/${lessonId}/versions/${versionId}`);
};

export const mergeBranch = async (
  lessonId: string,
  sourceBranchId: string,
  targetBranchId?: string,
) => {
  return authInstance.post(
    `/lessons/${lessonId}/branches/${sourceBranchId}/merge`,
    { targetBranchId },
  );
};

export const publishLesson = async (lessonId: string) => {
  return authInstance.post(`/lessons/${lessonId}/publish`);
};

export const unpublishLesson = async (lessonId: string) => {
  return authInstance.post(`/lessons/${lessonId}/unpublish`);
};

export const deleteLesson = async (lessonId: string, permanent = false) => {
  return authInstance.delete(`/lessons/${lessonId}`, {
    params: { permanent },
  });
};

// Versioning Service APIs
export const getLessonVersionGraph = async (lessonId: string) => {
  return authInstance.get(`/versioning/lessons/${lessonId}/graph`);
};

export const deleteWorkingDesk = async (deskId: string) => {
  return authInstance.delete(`/versioning/desks/${deskId}`);
};
