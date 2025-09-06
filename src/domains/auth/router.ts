import { createRoute } from "@tanstack/react-router";
import LoginPage from "./pages/login";
import { nonAuthenticateRoute } from "@/shared/lib/routers";
import Signup from "./pages/signup";

export const authRoute = createRoute({
  getParentRoute: () => nonAuthenticateRoute,
  path: "/login",
  component: LoginPage,
});

export const signupRoute = createRoute({
  getParentRoute: () => nonAuthenticateRoute,
  path: "/signup",
  component: Signup,
});
