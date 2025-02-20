import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/user/UserPage";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute page={<App />} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/post/:postId", element: <PostPage /> },
      { path: "/user/:userId", element: <UserPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/notification", element: <NotificationPage /> },
      { path: "/*", element: <div>Page not found</div> },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);
export default routes;
