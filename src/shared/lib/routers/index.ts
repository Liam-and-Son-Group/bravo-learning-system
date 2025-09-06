// src/router.tsx
import App from "@/App";
import { authRoute, signupRoute } from "@/domains/auth/router";
import {
  authoringRouter,
  authoringIndexRouter,
} from "@/domains/authoring/router";
import { courseRoute } from "@/domains/course/router";
import { homeRoute } from "@/domains/home/router";
import AppLayout from "@/shared/components/templates/AppLayout";
import NonAuthTemplate from "@/shared/components/templates/NonAuthLayout";
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// 1. Create root layout
const rootRoute = createRootRoute({
  component: App,
});

export const nonAuthenticateRoute = createRoute({
  id: "non-auth",
  getParentRoute: () => rootRoute,
  component: NonAuthTemplate,
});

export const authenticatedRoute = createRoute({
  id: "auth",
  getParentRoute: () => rootRoute,
  component: AppLayout,
});

const routeTree = rootRoute.addChildren([
  nonAuthenticateRoute,
  authenticatedRoute,
  authRoute,
  signupRoute,
  homeRoute,
  courseRoute,
  authoringRouter,
  authoringIndexRouter,
]);
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
