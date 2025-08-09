import { authenticatedRoute } from "@/shared/lib/routers";
import { createRoute } from "@tanstack/react-router";
import DirectoryBrowserTemplate from "./template";
import AuthoringPage from "./pages";

export const authoringRouter = createRoute({
  path: "/authoring",
  getParentRoute: () => authenticatedRoute,
  component: DirectoryBrowserTemplate,
});

export const authoringIndexRouter = createRoute({
  path: "/",
  getParentRoute: () => authoringRouter,
  component: AuthoringPage,
});
