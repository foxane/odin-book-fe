import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);

// Initialize eruda
/* if (import.meta.env.DEV) {
  import("eruda")
    .then((eruda) => {
      console.log(eruda);

      eruda.default.init();
    })
    .catch((err: unknown) => {
      console.log(err);
    });
}
 */
