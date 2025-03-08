import { useEffect, useState } from "react";
import useAuth from "../context/AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { authErrorHandler } from "../utils/authHelper";

function ProtectedRoute({ page }: { page: React.ReactNode }) {
  const user = useAuth((s) => s.user);
  const login = useAuth((s) => s.login);

  const navigate = useNavigate();
  const location = useLocation();
  const currentUrl = encodeURIComponent(location.pathname + location.search);
  const redirectUrl = currentUrl !== "%2F" ? `/auth?r=${currentUrl}` : "/auth";

  const [loading, setLoading] = useState(true);

  /**
   * Initial load token check
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return void navigate(redirectUrl, { replace: true });

    login(token)
      .catch((error: unknown) => {
        localStorage.removeItem("token");
        void navigate(redirectUrl, {
          replace: true,
          state: authErrorHandler(error),
        });
      })
      .finally(() => setLoading(false));
  }, [login, navigate, redirectUrl]);

  /**
   * Render loading on initial load
   */
  if (loading) return <LoadingScreen />;

  /**
   * Redirect to auth page with target url params
   */
  if (!user) return <Navigate to={redirectUrl} />;

  return page;
}

export default ProtectedRoute;
