import { createRoute } from "@tanstack/react-router";
import LoginPage from "./pages";
import { nonAuthenticateRoute } from "@/shared/lib/routers";

export const authRoute = createRoute({
  getParentRoute: () => nonAuthenticateRoute,
  path: "/login",
  component: LoginPage,
});
