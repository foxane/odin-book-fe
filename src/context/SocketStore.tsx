import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type ISocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketStore {
  socket: ISocket | null;
  initSocket: (token: string) => void;
  connected: boolean;
  disconnect: () => void;
}

export const useSocket = create<SocketStore>()((set, get) => ({
  socket: null,
  connected: false,

  initSocket: (token: string) => {
    if (get().socket) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });

    socket.on("connect", () => set({ connected: true }));
    socket.on("disconnect", () => set({ connected: false }));

    set({ socket });
  },

  disconnect: () => {
    set((state) => {
      state.socket?.disconnect();
      return { connected: false, socket: null };
    });
  },
}));
