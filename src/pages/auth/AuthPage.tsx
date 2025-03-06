import { Navigate, useSearchParams } from "react-router-dom";
import useAuth from "../../context/AuthContext";
import LoginForm from "./LoginForm";

export default function AuthPage() {
  const user = useAuth((s) => s.user);

  /**
   * Redirect when user is authenticated or token exist
   */
  const [params] = useSearchParams();
  if (user || localStorage.getItem("token")) {
    const redirectTarget = params.get("r") ?? "/";
    return <Navigate to={redirectTarget} replace />;
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}
