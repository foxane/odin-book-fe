import { create } from "zustand";
import { authService } from "../utils/services";

const useAuth = create<AuthZustand>()((set) => ({
  user: null,
  error: null,
  loading: false,

  login: (cred) => {
    set({ loading: true, error: null });
    authService
      .login(cred)
      .then((user) => set({ user }))
      .catch((err: unknown) => set({ error: err as AuthError }))
      .finally(() => set({ loading: false }));
  },

  logout: () => {
    set({ user: null });
    authService.logout();
  },

  refreshUser: async () => {
    const user = await authService.getUserInfo();
    set({ user });
  },

  register: (cred) => {
    set({ loading: true, error: null });
    authService
      .register(cred)
      .then((user) => set({ user }))
      .catch((err: unknown) => set({ error: err as AuthError }))
      .finally(() => set({ loading: false }));
  },

  /**
   * Initliad loading on page load
   */
  initAuth: () => {
    set({ loading: true });
    const token = () => localStorage.getItem("token");
    if (!token()) return set({ loading: false });

    authService
      .getUserInfo()
      .then((user) => set({ user }))
      .catch((err: unknown) => set({ error: err as AuthError }))
      .finally(() => set({ loading: false }));
  },
}));

export default useAuth;
