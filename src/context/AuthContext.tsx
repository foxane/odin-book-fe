import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../services/api";
import { AxiosError, AxiosResponse } from "axios";

const AuthContext = createContext<IAuthContext>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
  loading: false,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (cred: Credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.axios.post<{ token: string; user: User }>(
        "/auth/login",
        cred,
      );

      setUser(data.user);
      api.setToken(data.token);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response) {
          const data = err.response.data as AuthError;
          setError(data);
        } else {
          setError({ message: err.message });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {};
  const logout = () => {};

  // First load login
  useEffect(() => {
    if (!token) return;

    api.axios
      .get("/auth/me")
      .then((res: AxiosResponse<User>) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err: unknown) => {
        console.log(err);
        localStorage.removeItem("token");
      });
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, error, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
