import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import AppLayout from "./pages/AppLayout";
import AuthPage from "./pages/auth/AuthPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute page={<AppLayout />} />,
    children: [
      { path: "home", element: <p>home</p> },
      { path: "nothome", element: <p>home</p> },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
