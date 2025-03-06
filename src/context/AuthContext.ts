import { io, Socket } from "socket.io-client";
import { api } from "../utils/services";
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  socket: Socket | null;
  login: (token: string, user?: User) => Promise<void>;
  logout: () => void;
  connected: boolean;
  _initSocket: () => void;
}

const useAuth = create<AuthStore>()((set, get) => ({
  user: null,
  socket: null,
  connected: false,

  login: async (token, user) => {
    api.setToken(token);
    const userData = user ?? (await api.axios.get<User>("/auth/me")).data;
    set({ user: userData });
    localStorage.setItem("token", token);
    get()._initSocket();
  },

  logout: () => {
    get().socket?.disconnect();
    api.setToken(null);
    set({ user: null, socket: null });
    localStorage.removeItem("token");
  },

  _initSocket: () => {
    const token = localStorage.getItem("token");
    if (get().socket) return;

    const socket = io(import.meta.env.VITE_API_URL, { auth: { token } });
    socket.on("connect", () => {
      set({ connected: true });
    });
    socket.on("disconnect", () => {
      set({ connected: false });
    });

    set({ socket });
  },
}));

export default useAuth;
