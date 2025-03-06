import { useEffect, useState } from "react";
import useAuth from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return void navigate(redirectUrl, { replace: true });

    login(token)
      .catch((error: unknown) => {
        void navigate(redirectUrl, {
          replace: true,
          state: authErrorHandler(error),
        });
      })
      .finally(() => setLoading(false));
  }, [login, navigate, redirectUrl]);

  if (loading) return <LoadingScreen />;

  if (!user) return <Navigate to="/auth" />;

  return page;
}

export default ProtectedRoute;
