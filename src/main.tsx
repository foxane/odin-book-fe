import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={routes} />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>

    {import.meta.env.DEV && (
      <div className="fixed bottom-5 rounded border p-2 font-serif font-bold">
        <p className="sm:hidden">xs</p>
        <p className="hidden sm:block md:hidden">sm</p>
        <p className="hidden md:block lg:hidden">md</p>
        <p className="hidden lg:block xl:hidden">lg</p>
        <p className="hidden xl:block">xl</p>
      </div>
    )}
  </StrictMode>,
);
