import { createBrowserRouter } from "react-router-dom";
import ProtectRoute from "./Protected";
import App from "../App";

import Error404 from "../pages/error/404";
import AuthPage from "../pages/auth/AuthPage";
import HomePage from "../pages/home/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { index: true, element: <ProtectRoute page={<HomePage />} /> },
      { path: "*", element: <Error404 /> },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);
