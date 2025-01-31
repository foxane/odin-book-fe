import { createBrowserRouter } from "react-router-dom";
import IndexPage from "./pages/Index";
import AuthPage from "./pages/Auth";
import ProtectRoute from "./pages/Protected";
import App from "./App";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [{ index: true, element: <ProtectRoute page={<IndexPage />} /> }],
  },

  { path: "/auth", element: <AuthPage /> },
]);

export default routes;
