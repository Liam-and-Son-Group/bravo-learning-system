import { authenticatedRoute } from "@/shared/lib/routers";
import { createRoute } from "@tanstack/react-router";
import DirectoryBrowserTemplate from "./template";
import AuthoringPage from "./pages";
import ComposePage from "./pages/compose";

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

export const composeRouter = createRoute({
  path: "/compose/$lessonId",
  getParentRoute: () => authoringRouter,
  component: ComposePage,
});
