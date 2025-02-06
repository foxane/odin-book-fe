import { createBrowserRouter } from "react-router-dom";
import ProtectRoute from "./Protected";
import App from "../App";
import IndexPage from "../pages/home/HomePage";
import Error404 from "../pages/error/404";
import AuthPage from "../pages/auth/AuthPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { index: true, element: <ProtectRoute page={<IndexPage />} /> },
      { path: "*", element: <Error404 /> },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);
