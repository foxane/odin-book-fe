import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import AppLayout from "./pages/app/AppLayout";
import AuthPage from "./pages/auth/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/app/HomePage";
import { useEffect } from "react";
import useTheme from "./context/ThemeContext";
import PostPage from "./pages/app/PostPage";
import UserPage from "./pages/app/UserPage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorPage from "./pages/ErrorPage";
import SearchPage from "./pages/app/SearchPage";
import NotifPage from "./pages/app/NotifPage";
import ChatPage from "./pages/app/chat/ChatPage";
import { AuthPageProvider } from "./pages/auth/useAuthPage";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ToastContainer } from "react-toastify";

export type RouteParams = Record<"postId" | "userId" | "chatId", string>;
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute page={<AppLayout />} />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/post/:postId", element: <PostPage /> },
      { path: "/user/:userId", element: <UserPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/notification", element: <NotifPage /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "*", element: <ErrorPage text="Page not found" /> },
    ],
  },

  { path: "*", element: <ErrorPage text="Page not found" /> }, // 404 for not authentiicated users

  {
    path: "/auth",
    element: (
      <AuthPageProvider>
        <AuthPage />
      </AuthPageProvider>
    ),
  },
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
      <ReactQueryDevtools client={main} />
      <SpeedInsights />
      <Analytics />
      <ToastContainer
        theme="dark"
        position="bottom-right"
        toastStyle={{
          cursor: "pointer",
          backgroundColor: "var(--color-base-300)",
          color: "var(--color-base-content)",
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
