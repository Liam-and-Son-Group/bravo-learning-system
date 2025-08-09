import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // or './main.css'
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./shared/lib/routers/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
