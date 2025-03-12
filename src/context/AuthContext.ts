import { io, Socket } from "socket.io-client";
import { api } from "../utils/services";
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  login: (token: string, user?: User) => Promise<void>;
  logout: () => void;
  connected: boolean;
}

const useAuth = create<AuthStore>()((set, get) => ({
  user: null,
  socket: null,
  connected: false,

  login: async (token, user) => {
    api.setToken(token);
    const userData = user ?? (await api.axios.get<User>("/auth/me")).data;
    set({ user: userData });

    if (!get().socket) {
      const socket = io(import.meta.env.VITE_API_URL, { auth: { token } });
      set({ socket });
    }

    localStorage.setItem("token", token);
  },

  logout: () => {
    get().socket?.disconnect();
    api.setToken(null);
    set({ user: null, socket: null });
    localStorage.removeItem("token");
  },
}));

export default useAuth;
