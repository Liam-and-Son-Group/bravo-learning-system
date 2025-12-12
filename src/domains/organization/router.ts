import { authenticatedRoute } from "@/shared/lib/routers";
import { createRoute } from "@tanstack/react-router";
import OrganizationsPage from "./pages";
import OrganizationDetailPage from "./pages/detail";

// Placeholder list route (can be implemented later)
export const organizationsRoute = createRoute({
  path: "/organizations",
  getParentRoute: () => authenticatedRoute,
  component: OrganizationsPage,
});

export const organizationDetailRoute = createRoute({
  path: "/$id",
  getParentRoute: () => organizationsRoute,
  component: OrganizationDetailPage,
});
