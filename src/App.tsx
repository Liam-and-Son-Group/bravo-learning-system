import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import { Toaster } from "sonner";
import { useAuth } from "./shared/hooks/use-auth";

function App() {
  useAuth();
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </>
  );
}

export default App;
