import { useState } from "react";
import {
  AuthError,
  authErrorHandler,
  AuthResponse,
} from "../../utils/authHelper";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { api } from "../../utils/services";
import useAuth from "../../context/AuthContext";

interface LoginCredentials {
  email: string;
  password: string;
}

function LoginForm() {
  const login = useAuth((s) => s.login);
  const { register, handleSubmit } = useForm<LoginCredentials>();

  const location = useLocation();
  const passedError = location.state ? (location.state as AuthError) : null;
  const [error, setError] = useState<AuthError | null>(passedError);

  const onLogin: SubmitHandler<LoginCredentials> = async (cred) => {
    setError(null);
    try {
      const { data } = await api.axios.post<AuthResponse>("/auth/login", cred);
      void login(data.token, data.user);
    } catch (error) {
      setError(authErrorHandler(error));
    }
  };
  return (
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
  );
}

export default LoginForm;
