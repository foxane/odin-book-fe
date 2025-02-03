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

  /**
   * Can we take a moment to appreciete this sexiness? Thank you 💗
   */
  return (
    <div className="grid min-h-screen place-items-center items-center lg:grid-cols-2">
      <Hero className="hidden h-full lg:card" />
      <AuthForm className="mx-auto shadow-lg lg:shadow-2xl" />
      <Footer className="col-span-full mt-auto" />
    </div>
  );
}
