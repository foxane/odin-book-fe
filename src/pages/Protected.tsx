import { Link, Navigate, useLocation } from "react-router-dom";
import { SquirrelIcon } from "lucide-react";

import useAuth from "../hooks/useAuth";
import { getJoke } from "../lib/joke";
import { useEffect, useState } from "react";

interface Props {
  page: React.ReactNode;
}

export default function ProtectRoute({ page }: Props) {
  const { user, loading } = useAuth();
  const [isTimeout, setIsTimeout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, 1000 * 5);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Loading screen on initial load
   */
  if (loading) {
    return (
      <div className="absolute top-0 left-0 flex h-dvh w-screen flex-col items-center justify-center bg-base-100 px-10">
        <p className="inline-flex items-center gap-2 font-serif text-4xl">
          Twittard
          <SquirrelIcon size={40} strokeWidth={1} className="animate-bounce" />
        </p>
        {/* <p className="animate-pulse">Authenticating ...</p> */}
        <p className="mt-5 label text-center text-sm text-wrap italic">
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

  return page;
}
