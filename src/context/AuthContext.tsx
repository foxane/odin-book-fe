import { create } from "zustand";
import { authService } from "../utils/services";
import { io, Socket } from "socket.io-client";

interface AuthZustand extends IAuthContext {
  initAuth: () => void;
  _isInititalized: boolean;
  _initSocket: () => void;
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connected: boolean;
}

const useAuth = create<AuthZustand>()((set, get) => ({
  user: null,
  error: null,
  loading: true,
  socket: null,
  connected: false,
  _isInititalized: false,

  login: (cred) => {
    set({ loading: true, error: null });
    authService
      .login(cred)
      .then((user) => {
        get()._initSocket();
        set({ user });
      })
      .catch((err: unknown) => set({ error: err as AuthError }))
      .finally(() => set({ loading: false }));
  },

  register: (cred) => {
    set({ loading: true, error: null });
    authService
      .register(cred)
      .then((user) => {
        get()._initSocket();
        set({ user });
      })
      .catch((err: unknown) => set({ error: err as AuthError }))
      .finally(() => set({ loading: false }));
  },

  logout: () => {
    authService.logout();
    set((state) => {
      state.socket?.disconnect();
      return { user: null, socket: null, connected: false };
    });
  },

  refreshUser: async () => {
    const user = await authService.getUserInfo();
    set({ user });
  },

  /**
   * Initialize auth loading on page load
   */
  initAuth: () => {
    if (get()._isInititalized) return;
    set({ loading: true });
    const token = localStorage.getItem("token");
    if (!token) return set({ loading: false });

    authService
      .getUserInfo()
      .then((user) => {
        get()._initSocket();
        set({ user });
        console.log(
          get().connected ? "Socket connected" : "Socket not connected",
        );
      })
      .catch((err: unknown) => set({ error: err as AuthError }))
      .finally(() => set({ loading: false, _isInititalized: true }));
  },

  /**
   * Private method, initialize socket
   */
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
