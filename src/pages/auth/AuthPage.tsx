import { Navigate, useSearchParams } from "react-router-dom";

import AuthForm from "./AuthForm";
import useAuth from "../../hooks/useAuth";
import Hero from "./Hero";
import Footer from "../../components/Footer";

export default function AuthPage() {
  const { user } = useAuth();
  const [query] = useSearchParams();

  if (user) {
    const redirect = query.get("redirect") ?? "/";
    return <Navigate to={redirect} replace />;
  }

  /**
   * Can we take a moment to appreciete this sexiness? Thank you 💗
   */
  return (
    <div className="flex min-h-svh flex-col">
      <div className="grid h-full flex-1 place-items-center lg:grid-cols-2">
        <Hero className="hidden h-full lg:card" />
        <AuthForm className="mx-auto shadow-md lg:shadow-2xl dark:shadow-2xl" />
      </div>
      <Footer />
    </div>
  );
}
