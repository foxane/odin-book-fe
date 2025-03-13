import { SubmitHandler, useForm } from "react-hook-form";
import useAuth from "../../context/AuthContext";
import { api } from "../../utils/services";
import { authErrorHandler, AuthResponse } from "../../utils/authHelper";
import OAuthBtn from "./OAuthBtn";
import { useAuthPageContext } from "./useAuthPage";

interface Fields {
  name: string;
  email: string;
  password: string;
  confirmPw: string;
}

function AuthForm({
  isRegister,
  changeForm,
}: {
  isRegister: boolean;
  changeForm: () => void;
}) {
  const authenticate = useAuth((s) => s.login);
  const { error, setError, setLoading } = useAuthPageContext();

  const { register, handleSubmit, watch, formState } = useForm<Fields>();

  const onSubmit: SubmitHandler<Fields> = async (cred) => {
    setError(null);
    setLoading(isRegister ? "Registering account..." : "Logging in...");
    try {
      const { data } = isRegister
        ? await api.axios.post<AuthResponse>("/auth/register", cred)
        : await api.axios.post<AuthResponse>(`/auth/login`, cred);
      await authenticate(data.token, data.user);
    } catch (error) {
      setError(authErrorHandler(error));
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="alert-soft alert alert-vertical alert-error my-2">
            <p className="card-title">{error.message}</p>
            {error.errorDetails && (
              <ul>
                {error.errorDetails.map((el) => (
                  <li key={el}>{el}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {isRegister && (
          <label className="floating-label">
            <input
              className="input w-full"
              placeholder="Full Name"
              {...register("name", {
                required: "Name cannot be empty",
                minLength: {
                  message: "Name need to be at least 3 characters long",
                  value: 3,
                },
                maxLength: {
                  message: "Name need to be under 20 characters long",
                  value: 20,
                },
              })}
            />
            <span>Full Name</span>
            <p className="validator-hint text-error">
              {formState.errors.name?.message}
            </p>
          </label>
        )}

        <label className="floating-label">
          <input
            placeholder="Email Address"
            className="input w-full"
            {...register("email", {
              required: "Email cannot be empty",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          <span>Email Address</span>
          <p className="validator-hint text-error">
            {formState.errors.email?.message}
          </p>
        </label>

        <label className="floating-label">
          <input
            className="input w-full"
            placeholder="New Password"
            type="password"
            {...register("password", {
              required: "New password cannot be empty",
              minLength: {
                message: "Password need to be at least 2 characters long",
                value: 2,
              },
              maxLength: {
                message: "Password need to be under 20 characters long",
                value: 20,
              },
            })}
          />
          <span>New Password</span>
          <p className="validator-hint text-error">
            {formState.errors.password?.message}
          </p>
        </label>

        {isRegister && (
          <label className="floating-label">
            <input
              className="input w-full"
              placeholder="Confirm Password"
              type="password"
              {...register("confirmPw", {
                validate: (val) =>
                  val === watch("password") ? true : "Password did not match",
              })}
            />
            <span>Confirm Password</span>
            <p className="validator-hint text-error">
              {formState.errors.confirmPw?.message}
            </p>
          </label>
        )}

        <button
          disabled={formState.isSubmitting}
          className="btn btn-primary btn-block"
          type="submit"
        >
          {isRegister ? "Register" : "Log In"}
        </button>
      </form>

      <div className="flex justify-center gap-x-2 text-sm">
        <p>
          {isRegister ? "Already have an account?" : "Don't have an account?"}
        </p>
        <button onClick={changeForm} className="link">
          {isRegister ? "Login" : "Register"}
        </button>
      </div>

      <div className="divider text-sm">OR</div>

      <OAuthBtn />
    </>
  );
}

export default AuthForm;
