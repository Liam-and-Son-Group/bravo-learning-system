import { createRoute } from "@tanstack/react-router";
import CoursePage from "./pages/CoursePage";
import { authenticatedRoute } from "@/shared/lib/routers";

export const courseRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/course/$id",
  component: CoursePage,
  loader: async ({ params }) => {
    const res = await fetch(`/api/course/${params.id}`);
    if (!res.ok) throw new Error("Failed to fetch course");
    return res.json();
  },
});
