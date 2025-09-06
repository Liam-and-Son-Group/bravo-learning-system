import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // or './main.css'
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./shared/lib/routers/index.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/lib/query/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
