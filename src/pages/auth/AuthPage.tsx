import { Navigate, useSearchParams } from "react-router-dom";
import useAuth from "../../context/AuthContext";
import AuthForm from "./AuthForm";
import { BotIcon, MoonIcon, SunIcon } from "lucide-react";
import useTheme from "../../context/ThemeContext";
import Hero from "./Hero";
import { useState } from "react";

function AuthPage() {
  const user = useAuth((s) => s.user);
  const toggleTheme = useTheme((s) => s.toggle);
  const isDark = useTheme((s) => s.isDark);

  const [isRegister, setIsRegister] = useState(false);

  /**
   * Redirect when user is authenticated or token exist
   */
  const [params] = useSearchParams();
  if (user || localStorage.getItem("token")) {
    const redirectTarget = params.get("r") ?? "/";
    return <Navigate to={redirectTarget} replace />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-evenly">
      <section className="hidden lg:block">
        <Hero />
      </section>
      <section className="relative w-[30rem] space-y-5 rounded px-5 py-6 shadow-md dark:shadow-xl">
        <button
          className="btn btn-square btn-ghost absolute right-5"
          onClick={toggleTheme}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        <div>
          <h1 className="card-title font-serif text-2xl">
            <BotIcon size={40} className="stroke-accent" />
            {import.meta.env.VITE_APP_NAME}
          </h1>
          <p className="label mb-2 text-sm">
            {isRegister ? "Register" : "Login"} to{" "}
            {import.meta.env.VITE_APP_NAME}
          </p>
        </div>

        <AuthForm
          isRegister={isRegister}
          changeForm={() => setIsRegister(!isRegister)}
        />
      </section>
    </div>
  );
}

export default AuthPage;
