import { authenticatedRoute } from "@/shared/lib/routers";
import { createRoute } from "@tanstack/react-router";
import ClassroomsPage from "./pages";
import ClassroomDetailPage from "./pages/detail";

export const classroomsRoute = createRoute({
  path: "/classrooms",
  getParentRoute: () => authenticatedRoute,
  component: ClassroomsPage,
});

export const classroomDetailRoute = createRoute({
  path: "/$id",
  getParentRoute: () => classroomsRoute,
  component: ClassroomDetailPage,
});
