import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/home/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";
import PostPage from "./pages/post/PostPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute page={<App />} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/post/:postId", element: <PostPage /> },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);
export default routes;
