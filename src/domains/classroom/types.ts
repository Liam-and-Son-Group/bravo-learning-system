// Classroom domain types
export type ClassroomStatus = "active" | "disabled";

export interface Classroom {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  organizationName: string;
  studentsCount: number;
  createdAt: string; // ISO date
  status: ClassroomStatus;
  enrollmentKey: string;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  email: string;
  role: string; // e.g. 'student' | 'teacher'
  joinedAt: string; // ISO date
}

export interface CreateClassroomPayload {
  name: string;
  description?: string;
  organizationId: string;
  enrollmentKey: string;
}

export interface UpdateClassroomPayload {
  id: string;
  name?: string;
  description?: string;
  status?: ClassroomStatus;
}

export interface ClassroomListFilters {
  scope: "mine" | "organizations";
  search?: string;
  sort?: "name" | "createdAt" | "studentsCount";
  order?: "asc" | "desc";
}
