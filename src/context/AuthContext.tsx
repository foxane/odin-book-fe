import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../services/api";
import { AxiosError, AxiosResponse } from "axios";

const AuthContext = createContext<IAuthContext>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  const login = async (cred: Credentials) => {
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
    <AuthContext.Provider value={{ user, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
