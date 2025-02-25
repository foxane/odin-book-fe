import { Link, Navigate, useLocation } from "react-router-dom";
import { SquirrelIcon } from "lucide-react";

import useAuth from "../context/AuthContext";
import { getJoke } from "../utils/helper";
import { useEffect, useState } from "react";
import { NotifProvider } from "../context/NotifContext";
import { MessageProvider } from "../context/MessageContext";

interface Props {
  page: React.ReactNode;
}

export default function ProtectedRoute({ page }: Props) {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);

  const [isTimeout, setIsTimeout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, 1000 * 10);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Loading screen on initial load
   */
  if (loading) {
    return (
      <div className="bg-base-100 absolute left-0 top-0 z-50 flex h-dvh w-screen flex-col items-center justify-center px-10">
        <p className="inline-flex items-center gap-2 font-serif text-4xl">
          Twittard
          <SquirrelIcon size={40} strokeWidth={1} className="animate-bounce" />
        </p>
        {/* <p className="animate-pulse">Authenticating ...</p> */}
        <p className="label mt-5 text-wrap text-center text-sm italic">
          {getJoke()}
        </p>

        <div
          className={`absolute bottom-10 text-center text-sm ${!isTimeout ? "hidden" : ""}`}
        >
          <p className="text-error">Something seems to be wrong...</p>
          <Link to="https://github.com/foxane/" className="link">
            Report this problem
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?login=true&redirect=${redirectUrl}`} replace />;
  }

  /**
   * Context for authenticated user is used here
   */
  return (
    <NotifProvider>
      <MessageProvider>{page}</MessageProvider>
    </NotifProvider>
  );
}
