import { io, Socket } from "socket.io-client";
import { api } from "../utils/services";
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  socket: Socket | null;
  login: (token: string, user?: User) => Promise<void>;
  logout: () => void;
}

const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  socket: null,
  login: async (token, user) => {
    try {
      api.setToken(token);
      const socket = io(import.meta.env.VITE_API_URL, { auth: { token } });
      const newUserData = user ?? (await api.axios.get<User>("/auth/me")).data;
      set({ user: newUserData, socket });
      localStorage.setItem("token", token);
    } catch (error) {
      localStorage.removeItem("token");
      api.setToken(null);
      throw error;
    }
  },
  logout: () => {
    api.setToken(null);
    get().socket?.disconnect();
    set({ user: null, socket: null });
    localStorage.removeItem("token");
  },
}));

export default useAuth;
