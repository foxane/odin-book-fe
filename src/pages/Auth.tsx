import { Navigate, useSearchParams } from "react-router-dom";

import AuthForm from "../components/AuthForm";
import useAuth from "../hooks/useAuth";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function AuthPage() {
  const { user } = useAuth();
  const [query] = useSearchParams();

  if (user) {
    const redirect = query.get("redirect") ?? "/";
    return <Navigate to={redirect} replace />;
  }

  return (
    <div className="flex h-screen grid-cols-2 grid-rows-1 flex-col items-center justify-center lg:grid">
      <div className="hidden h-full lg:block">
        <Hero />
      </div>

      <div className="flex grow place-items-center items-center justify-center">
        <AuthForm />
      </div>

      <div className="col-span-full w-full">
        <Footer />
      </div>
    </div>
  );
}
