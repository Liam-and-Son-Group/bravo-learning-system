import { authInstance } from "@/shared/lib/axios";

export interface FolderTreeNode {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  parentId: string | null;
  isSystem: boolean;
  children: FolderTreeNode[];
  lessonCount: number;
}

export interface FolderTreeResponse {
  folders: FolderTreeNode[];
}

export interface CreateFolderDto {
  name: string;
  color?: string;
  icon?: string;
  parentId?: string;
}

export interface UpdateFolderDto {
  name?: string;
  color?: string;
  icon?: string;
}

export interface MoveFolderDto {
  newParentId: string | null;
}

// Get folder tree for current user
export const getFolderTree = async (): Promise<FolderTreeResponse> => {
  const response = await authInstance.get<FolderTreeResponse>("/folders/tree");
  // Backend returns { folders: [...] } directly
  return response.data;
};

// Create a new folder
export const createFolder = async (
  dto: CreateFolderDto
): Promise<FolderTreeNode> => {
  const response = await authInstance.post("/folders", dto);
  return response.data;
};

// Update folder details
export const updateFolder = async (
  id: string,
  dto: UpdateFolderDto
): Promise<FolderTreeNode> => {
  const response = await authInstance.patch(`/folders/${id}`, dto);
  return response.data;
};

// Move folder to a different parent
export const moveFolder = async (
  id: string,
  dto: MoveFolderDto
): Promise<FolderTreeNode> => {
  const response = await authInstance.patch(`/folders/${id}/move`, dto);
  return response.data;
};

// Delete an empty folder
export const deleteFolder = async (id: string): Promise<void> => {
  await authInstance.delete(`/folders/${id}`);
};
