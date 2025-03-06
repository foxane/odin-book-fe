import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../context/AuthContext";
import {
  AuthError,
  AuthResponse,
  authErrorHandler,
} from "../../utils/authHelper";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../utils/services";

interface LoginCredentials {
  email: string;
  password: string;
}

export default function AuthPage() {
  const login = useAuth((s) => s.login);
  const location = useLocation();
  const navigate = useNavigate();
  const passedError = location.state ? (location.state as AuthError) : null;

  const [error, setError] = useState<AuthError | null>(passedError);
  const { register, handleSubmit } = useForm<LoginCredentials>();

  const onLogin: SubmitHandler<LoginCredentials> = async (cred) => {
    setError(null);
    try {
      const { data } = await api.axios.post<AuthResponse>("/auth/login", cred);
      void login(data.token, data.user);
      void navigate("/", { replace: true });
    } catch (error) {
      setError(authErrorHandler(error));
    }
  };

  if (localStorage.getItem("token")) return <Navigate to={"/"} replace />;
  return (
    <div>
      <form onSubmit={handleSubmit(onLogin)}>
        {error && (
          <div className="alert alert-error">
            <p>{error.message}</p>
          </div>
        )}

        <input
          className="input"
          type="email"
          {...register("email", { required: true })}
        />

        <input
          className="input"
          type="password"
          {...register("password", { required: true })}
        />
        <button className="login">Submit</button>
      </form>
    </div>
  );
}
