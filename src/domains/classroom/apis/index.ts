import type {
  Classroom,
  ClassroomListFilters,
  ClassroomStudent,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "../types";
import { authInstance } from "@/shared/lib/axios";

// Backend response types
interface LearningSpaceResponse {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    avatar?: string;
  };
  _count?: {
    enrolments: number;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}

// Helper to transform backend response to frontend Classroom type
function transformLearningSpace(ls: LearningSpaceResponse): Classroom {
  return {
    id: ls.id,
    name: ls.name,
    description: undefined, // Backend doesn't have description field yet
    organizationId: ls.organizationId,
    organizationName: ls.organization?.name || "Unknown Organization",
    organizationLogo: ls.organization?.avatar,
    studentsCount: ls._count?.enrolments || 0,
    createdAt: ls.createdAt,
    status: "active", // Backend doesn't have status field yet
    enrollmentKey: "", // Backend doesn't return this in list
  };
}

export async function fetchClassrooms(
  filters: ClassroomListFilters,
  organizationId: string
): Promise<Classroom[]> {
  // TODO: Implement scope filtering (mine, organizations, shared)
  // For now, fetch all classrooms for the organization

  const params: Record<string, any> = {
    page: 1,
    pageSize: 100, // Fetch all for now
  };

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.sort) {
    params.sortBy =
      filters.sort === "studentsCount" ? "createdAt" : filters.sort;
  }

  if (filters.order) {
    params.sortOrder = filters.order;
  }

  const response = await authInstance.get<
    PaginatedResponse<LearningSpaceResponse>
  >(`/organizations/${organizationId}/learning-spaces`, { params });

  return response.data.data.map(transformLearningSpace);
}

export async function fetchClassroom(
  id: string,
  organizationId: string
): Promise<Classroom> {
  const response = await authInstance.get<LearningSpaceResponse>(
    `/organizations/${organizationId}/learning-spaces/${id}`,
    {
      params: {
        includeCounts: "true",
      },
    }
  );

  return transformLearningSpace(response.data);
}

export async function fetchClassroomStudents(
  classroomId: string,
  organizationId: string
): Promise<ClassroomStudent[]> {
  const response = await authInstance.get<any[]>(
    `/organizations/${organizationId}/learning-spaces/${classroomId}/enrolments`
  );

  return response.data.map((enrolment: any) => ({
    id: enrolment.userId,
    name: enrolment.user?.name || "Unknown",
    email: enrolment.user?.email || "",
    role: enrolment.role || "student",
    joinedAt: enrolment.enrolledAt,
  }));
}

export async function createClassroom(
  payload: CreateClassroomPayload
): Promise<Classroom> {
  const response = await authInstance.post<LearningSpaceResponse>(
    `/organizations/${payload.organizationId}/learning-spaces`,
    {
      name: payload.name,
      // Note: Backend doesn't support description or enrollmentKey yet
    }
  );

  return transformLearningSpace(response.data);
}

export async function updateClassroom(
  _payload: UpdateClassroomPayload
): Promise<Classroom> {
  // Extract organizationId from payload or get from context
  // For now, we'll need to pass it separately
  throw new Error(
    "Update classroom not fully implemented - need organizationId"
  );

  // TODO: Implement once we have organizationId available
  // const response = await authInstance.patch<LearningSpaceResponse>(
  //   `/organizations/${organizationId}/learning-spaces/${payload.id}`,
  //   {
  //     name: payload.name,
  //   }
  // );
  // return transformLearningSpace(response.data);
}

export async function toggleClassroomStatus(
  id: string,
  next: "active" | "disabled"
): Promise<{ id: string; status: "active" | "disabled" }> {
  // Backend doesn't support status toggling yet
  // This would need to be implemented in the backend first
  return Promise.resolve({ id, status: next });
}

export async function leaveClassroom(
  classroomId: string,
  userId: string,
  organizationId: string
): Promise<{ id: string; left: true }> {
  await authInstance.delete(
    `/organizations/${organizationId}/learning-spaces/${classroomId}/enrolments/${userId}`
  );

  return { id: classroomId, left: true };
}
