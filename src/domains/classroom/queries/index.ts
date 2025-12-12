import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createClassroom,
  fetchClassroom,
  fetchClassroomStudents,
  fetchClassrooms,
  leaveClassroom,
  toggleClassroomStatus,
  updateClassroom,
} from "../apis";
import type {
  ClassroomListFilters,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "../types";

export const CLASSROOM_QUERY_KEYS = {
  list: (filters: ClassroomListFilters, organizationId: string) =>
    ["classrooms", filters, organizationId] as const,
  detail: (id: string, organizationId: string) =>
    ["classroom", id, organizationId] as const,
  students: (id: string, organizationId: string) =>
    ["classroom", id, "students", organizationId] as const,
};

export function useClassroomsQuery(
  filters: ClassroomListFilters,
  organizationId: string | null
) {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.list(filters, organizationId || ""),
    queryFn: () => fetchClassrooms(filters, organizationId!),
    enabled: !!organizationId,
  });
}

export function useClassroomQuery(id: string, organizationId: string | null) {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.detail(id, organizationId || ""),
    queryFn: () => fetchClassroom(id, organizationId!),
    enabled: !!id && !!organizationId,
  });
}

export function useClassroomStudentsQuery(
  id: string,
  organizationId: string | null
) {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.students(id, organizationId || ""),
    queryFn: () => fetchClassroomStudents(id, organizationId!),
    enabled: !!id && !!organizationId,
  });
}

export function useCreateClassroomMutation() {
  return useMutation({
    mutationFn: (payload: CreateClassroomPayload) => createClassroom(payload),
  });
}

export function useUpdateClassroomMutation() {
  return useMutation({
    mutationFn: (payload: UpdateClassroomPayload) => updateClassroom(payload),
  });
}

export function useToggleClassroomStatusMutation() {
  return useMutation({
    mutationFn: ({ id, next }: { id: string; next: "active" | "disabled" }) =>
      toggleClassroomStatus(id, next),
  });
}

export function useLeaveClassroomMutation() {
  return useMutation({
    mutationFn: ({
      classroomId,
      userId,
      organizationId,
    }: {
      classroomId: string;
      userId: string;
      organizationId: string;
    }) => leaveClassroom(classroomId, userId, organizationId),
  });
}
