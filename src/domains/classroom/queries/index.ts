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
  list: (filters: ClassroomListFilters) => ["classrooms", filters] as const,
  detail: (id: string) => ["classroom", id] as const,
  students: (id: string) => ["classroom", id, "students"] as const,
};

export function useClassroomsQuery(filters: ClassroomListFilters) {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.list(filters),
    queryFn: () => fetchClassrooms(filters),
  });
}

export function useClassroomQuery(id: string) {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.detail(id),
    queryFn: () => fetchClassroom(id),
    enabled: !!id,
  });
}

export function useClassroomStudentsQuery(id: string) {
  return useQuery({
    queryKey: CLASSROOM_QUERY_KEYS.students(id),
    queryFn: () => fetchClassroomStudents(id),
    enabled: !!id,
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
  return useMutation({ mutationFn: (id: string) => leaveClassroom(id) });
}
