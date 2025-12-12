// src/router.tsx
import App from "@/App";
import { authRoute, signupRoute } from "@/domains/auth/router";
import {
  authoringRouter,
  authoringIndexRouter,
  composeRouter,
} from "@/domains/authoring/router";
import { courseRoute } from "@/domains/course/router";
import {
  classroomDetailRoute,
  classroomsRoute,
} from "@/domains/classroom/router";
import {
  organizationsRoute,
  organizationDetailRoute,
} from "@/domains/organization/router";
import { homeRoute } from "@/domains/home/router";
import AppLayout from "@/shared/components/templates/AppLayout";
import NonAuthTemplate from "@/shared/components/templates/NonAuthLayout";
import NotFoundPage from "@/shared/components/templates/NotFound";
import { getAccessToken } from "@/shared/lib/axios";
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

// 1. Create root layout
const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: NotFoundPage,
});

export const nonAuthenticateRoute = createRoute({
  id: "non-auth",
  getParentRoute: () => rootRoute,
  component: NonAuthTemplate,
  beforeLoad: ({ location }) => {
    console.log(
      "🔓 [NON-AUTH ROUTE] beforeLoad triggered, pathname:",
      location.pathname
    );
    const token = getAccessToken();
    console.log(
      "🔓 [NON-AUTH ROUTE] Token from getAccessToken():",
      token ? "✅ EXISTS" : "❌ NULL"
    );

    if (token) {
      console.log("🔓 [NON-AUTH ROUTE] Token exists, redirecting to /");
      throw redirect({ to: "/", replace: true });
    }

    console.log(
      "🔓 [NON-AUTH ROUTE] No token, allowing access to non-auth page"
    );
  },
});

export const authenticatedRoute = createRoute({
  id: "auth",
  getParentRoute: () => rootRoute,
  component: AppLayout,
  beforeLoad: ({ location }) => {
    console.log(
      "🔒 [AUTH ROUTE] beforeLoad triggered, pathname:",
      location.pathname
    );
    const token = getAccessToken();
    console.log(
      "🔒 [AUTH ROUTE] Token from getAccessToken():",
      token ? "✅ EXISTS" : "❌ NULL"
    );

    if (!token) {
      console.log("🔒 [AUTH ROUTE] No token, redirecting to /login");
      throw redirect({ to: "/login", replace: true });
    }

    console.log(
      "🔒 [AUTH ROUTE] Token exists, allowing access to protected page"
    );
  },
});

const routeTree = rootRoute.addChildren([
  nonAuthenticateRoute.addChildren([authRoute, signupRoute]),
  authenticatedRoute.addChildren([
    homeRoute,
    courseRoute,
    authoringRouter.addChildren([authoringIndexRouter, composeRouter]),
    classroomsRoute.addChildren([classroomDetailRoute]),
    organizationsRoute.addChildren([organizationDetailRoute]),
  ]),
]);
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
