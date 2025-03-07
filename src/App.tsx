import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import AppLayout from "./pages/app/AppLayout";
import AuthPage from "./pages/auth/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/app/HomePage";
import { useEffect } from "react";
import useTheme from "./context/ThemeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute page={<AppLayout />} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <p>home</p> },
      { path: "nothome", element: <p>home</p> },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);

const main = new QueryClient();

function App() {
  const initTheme = useTheme((s) => s.init);

  useEffect(() => {
    initTheme();
  }, [initTheme]);
  return (
    <QueryClientProvider client={main}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
