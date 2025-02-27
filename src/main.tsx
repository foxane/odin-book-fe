import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import routes from "./router";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
      <ReactQueryDevtools client={queryClient} />
    </QueryClientProvider>
  </StrictMode>,
);
