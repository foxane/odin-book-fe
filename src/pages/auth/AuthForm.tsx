import { useState } from "react";
import { SquirrelIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import ThemeBtn from "./ThemeBtn";
import useAuth from "../../context/AuthContext";
import InputField from "./InputField";
import OAuthBtn from "./OAuthBtn";

export default function AuthForm({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [params] = useSearchParams();

  const error = useAuth((s) => s.error);
  const loading = useAuth((s) => s.loading);
  const login = useAuth((s) => s.login);
  const register = useAuth((s) => s.register);

  const isLogin = params.get("login") === "true";
  const redirect = params.get("redirect") ?? "";

  const [cred, setCred] = useState<Credentials>({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target as {
      name: "name" | "email" | "password";
      value: "string";
    };

    setCred({ ...cred, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      login(cred);
    } else {
      register(cred);
    }
  };
  return (
    <div
      className={twMerge(
        "card bg-base-100 w-full max-w-[30rem] gap-3 p-5 shadow-2xl",
        className,
      )}
      {...props}
    >
      <ThemeBtn className="absolute right-5 z-10" />

      <h1 className="card-title font-serif text-2xl">
        <SquirrelIcon className="stroke-accent" />
        Twittard
      </h1>
      <p className="label mb-2">{isLogin ? "Login" : "Register"} to Twittard</p>

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

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {!isLogin && (
          <InputField
            name="name"
            value={cred.name}
            onChange={handleChange}
            minLength={3}
            maxLength={20}
            errorMessage="Full name need to be between 3-20 characters"
            label="Full Name"
            type="text"
            required
          />
        )}

        <InputField
          name="email"
          value={cred.email}
          onChange={handleChange}
          errorMessage="Invalid email address"
          label="Email"
          type="email"
          required
        />

        <InputField
          name="password"
          value={cred.password}
          onChange={handleChange}
          errorMessage="Password need to be at least 2 character"
          label="Password"
          type="password"
          minLength={2}
          required
        />

        <button
          disabled={loading}
          className="btn btn-block btn-primary relative"
        >
          {loading ? (
            <span className="loading left-[7.5rem]" />
          ) : isLogin ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>

        <div className="text-sm">
          <p>
            {isLogin ? "Don't have an account?" : "Alredy have an account?"}
            {isLogin ? (
              <Link
                className="link ms-2"
                to={`/auth?login=false&redirect=${redirect}`}
              >
                Register
              </Link>
            ) : (
              <Link
                className="link ms-2"
                to={`/auth?login=true&redirect=${redirect}`}
              >
                Login
              </Link>
            )}
          </p>
          <p className="link">Fotgot password?</p>
        </div>
      </form>

      <div className="divider text-sm">OR</div>

      <OAuthBtn />
    </div>
  );
}
