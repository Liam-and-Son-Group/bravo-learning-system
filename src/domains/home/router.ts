import { authenticatedRoute } from "@/shared/lib/routers";
import { createRoute } from "@tanstack/react-router";
import HomePage from "./pages";

export const homeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  component: HomePage,
  path: "/",
});
