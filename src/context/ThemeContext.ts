import { create } from "zustand";

interface ThemeContext {
  isDark: boolean;
  toggle: () => void;
  init: () => void;
  initialized: boolean;
}

const useTheme = create<ThemeContext>()((set, get) => ({
  initialized: false,
  isDark: false,

  init() {
    if (get().initialized) return;
    const isDark = localStorage.getItem("theme") === "dark";
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );

    set({ isDark, initialized: true });
  },
  toggle() {
    const isDark = !get().isDark;
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );

    set({ isDark });
  },
}));

export default useTheme;
