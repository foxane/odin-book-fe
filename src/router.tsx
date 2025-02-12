import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/home/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";
import PostPage from "./pages/post/PostPage";
import UserPage from "./pages/user/UserPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute page={<App />} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/post/:postId", element: <PostPage /> },
      { path: "/user/:userId", element: <UserPage /> },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);
export default routes;
