import { authenticatedRoute } from "@/shared/lib/routers";
import { createRoute } from "@tanstack/react-router";
import ClassroomsPage from "./pages";
import ClassroomDetailPage from "./pages/detail";

type ClassroomScope = "mine" | "organizations" | "shared";
interface ClassroomSearch {
  scope: ClassroomScope;
  q: string;
}

function isScope(value: unknown): value is ClassroomScope {
  return value === "mine" || value === "organizations" || value === "shared";
}

export const classroomsRoute = createRoute({
  path: "/classrooms",
  getParentRoute: () => authenticatedRoute,
  validateSearch: (search: Record<string, unknown>): ClassroomSearch => {
    const scope = isScope(search.scope) ? search.scope : "mine";
    const q = typeof search.q === "string" ? search.q : "";
    return { scope, q };
  },
  component: ClassroomsPage,
});

export const classroomDetailRoute = createRoute({
  path: "/$id",
  getParentRoute: () => classroomsRoute,
  component: ClassroomDetailPage,
});
