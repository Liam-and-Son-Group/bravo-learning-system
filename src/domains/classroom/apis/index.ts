import type {
  Classroom,
  ClassroomListFilters,
  ClassroomStudent,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "../types";

// Placeholder API implementations using Promises.
// Replace fetch/axios logic when backend endpoints are available.

export async function fetchClassrooms(
  _filters: ClassroomListFilters
): Promise<Classroom[]> {
  // TODO integrate real API
  return Promise.resolve([
    {
      id: "cls_1",
      name: "Algebra Fundamentals",
      description: "Introductory algebra concepts",
      organizationId: "org_1",
      organizationName: "Bravo Learning Space",
      studentsCount: 24,
      createdAt: new Date().toISOString(),
      status: "active",
      enrollmentKey: "ALG-1234",
    },
  ]);
}

export async function fetchClassroom(id: string): Promise<Classroom> {
  return Promise.resolve({
    id,
    name: "Algebra Fundamentals",
    description: "Introductory algebra concepts",
    organizationId: "org_1",
    organizationName: "Bravo Learning Space",
    studentsCount: 24,
    createdAt: new Date().toISOString(),
    status: "active",
    enrollmentKey: "ALG-1234",
  });
}

export async function fetchClassroomStudents(
  _classroomId: string
): Promise<ClassroomStudent[]> {
  return Promise.resolve([
    {
      id: "stu_1",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "student",
      joinedAt: new Date().toISOString(),
    },
  ]);
}

export async function createClassroom(
  payload: CreateClassroomPayload
): Promise<Classroom> {
  return Promise.resolve({
    id: "cls_new",
    name: payload.name,
    description: payload.description,
    organizationId: payload.organizationId,
    organizationName: "Bravo Learning Space", // placeholder
    studentsCount: 0,
    createdAt: new Date().toISOString(),
    status: "active",
    enrollmentKey: payload.enrollmentKey,
  });
}

export async function updateClassroom(
  payload: UpdateClassroomPayload
): Promise<Classroom> {
  return Promise.resolve({
    id: payload.id,
    name: payload.name || "Updated Classroom",
    description: payload.description,
    organizationId: "org_1",
    organizationName: "Bravo Learning Space",
    studentsCount: 24,
    createdAt: new Date().toISOString(),
    status: payload.status || "active",
    enrollmentKey: "ALG-1234",
  });
}

export async function toggleClassroomStatus(
  id: string,
  next: "active" | "disabled"
): Promise<{ id: string; status: "active" | "disabled" }> {
  return Promise.resolve({ id, status: next });
}

export async function leaveClassroom(
  id: string
): Promise<{ id: string; left: true }> {
  return Promise.resolve({ id, left: true });
}
