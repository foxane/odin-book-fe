import { createContext, ReactNode, useEffect, useState } from "react";
import { authService } from "../utils/services";

const TOKEN = localStorage.getItem("token");
const AuthContext = createContext<IAuthContext>({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  refreshUser: async () => {},
  error: null,
  loading: false,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (cred: Credentials) => {
    setLoading(true);
    setError(null);
    authService
      .login(cred)
      .then((user) => setUser(user))
      .catch((err: unknown) => setError(err as AuthError))
      .finally(() => setLoading(false));
  };

  const register = (cred: Credentials) => {
    setLoading(true);
    setError(null);
    authService
      .register(cred)
      .then((user) => setUser(user))
      .catch((err: unknown) => setError(err as AuthError))
      .finally(() => setLoading(false));
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const refreshUser = async () => {
    const user = await authService.getUserInfo();
    setUser(user);
  };

  /**
   * Initial load login
   */
  useEffect(() => {
    if (!TOKEN) {
      setLoading(false);
      return;
    }

    setLoading(true);

    authService
      .getUserInfo()
      .then((user) => setUser(user))
      .catch((err: unknown) => setError(err as AuthError))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
