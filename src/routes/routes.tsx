import { createBrowserRouter } from "react-router-dom";
import IndexPage from "../pages/Index";
import AuthPage from "../pages/Auth";
import ProtectRoute from "./Protected";
import App from "../App";
import ProfilePage from "../pages/Profile";
import Error404 from "../pages/404";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { index: true, element: <ProtectRoute page={<IndexPage />} /> },
      { path: "/profile", element: <ProtectRoute page={<ProfilePage />} /> },
      { path: "*", element: <Error404 /> },
    ],
  },

  { path: "/auth", element: <AuthPage /> },
]);

export default routes;
