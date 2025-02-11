import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute page={<App />} />,
    children: [{ index: true, element: <HomePage /> }],
  },

  { path: "/auth", element: <AuthPage /> },
]);
export default routes;
