import { Navigate } from "react-router-dom";

import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";
import Hero from "../components/Hero";

export default function AuthPage() {
  const { user } = useAuth();

  if (user) return <Navigate to={"/"} replace />;
  return (
    <div className="flex h-screen grid-cols-2 flex-col items-center justify-center lg:grid">
      <div className="hidden h-full lg:block">
        <Hero />
      </div>

      <div className="place-items-center">
        <AuthForm />
      </div>
    </div>
  );
}
