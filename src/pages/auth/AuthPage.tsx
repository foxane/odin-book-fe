import { Navigate, useSearchParams } from "react-router-dom";

import AuthForm from "./AuthForm";
import useAuth from "../../context/AuthContext";
import Hero from "./Hero";
import { useEffect } from "react";

export default function AuthPage() {
  const user = useAuth((s) => s.user);
  const { initAuth } = useAuth(); // destructure does not re render on change

  const [query] = useSearchParams();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (user) {
    const redirect = query.get("redirect") ?? "/";
    return <Navigate to={redirect} replace />;
  }

  /**
   * Can we take a moment to appreciete this sexiness? Thank you 💗
   */
  return (
    <div className="bg-base-200 flex min-h-svh flex-col">
      <div className="grid h-full flex-1 place-items-center lg:grid-cols-2">
        <Hero className="lg:card hidden h-full" />
        <AuthForm className="mx-auto shadow-md lg:shadow-2xl dark:shadow-2xl" />
      </div>
    </div>
  );
}
