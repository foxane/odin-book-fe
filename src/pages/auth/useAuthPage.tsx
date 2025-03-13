import { createContext, useContext, useState } from "react";
import { AuthError } from "../../utils/authHelper";

/**
 * Centralized auth page state
 */
interface AuthPageContext {
  isLoading: string | null;
  setLoading: (_: string | null) => void;
  error: AuthError | null;
  setError: (_: AuthError | null) => void;
}

const AuthPageContext = createContext<AuthPageContext>({
  isLoading: null,
  error: null,
  setLoading: () => {},
  setError: () => {},
});

const AuthPageProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  return (
    <AuthPageContext.Provider
      value={{ isLoading: loading, setLoading, error, setError }}
    >
      {children}
      {loading !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="bg-neutral absolute inset-0 opacity-50"></div>

          {/* Card */}
          <div className="bg-base-100 card relative z-10 min-w-40 rounded-lg shadow-lg">
            <div className="card-body space-y-5">
              <span className="loading loading-xl mx-auto"></span>
              <p className="animate-pulse text-center">{loading}</p>
            </div>
          </div>
        </div>
      )}
    </AuthPageContext.Provider>
  );
};

const useAuthPageContext = () => useContext(AuthPageContext);

// eslint-disable-next-line react-refresh/only-export-components
export { AuthPageProvider, useAuthPageContext };
