import { create } from "zustand";

interface IThemeContext {
  isDark: boolean;
  toggle: () => void;
}

export const useTheme = create<IThemeContext>()((set, get) => {
  const isInitialDark = localStorage.getItem("is-dark") === "true";
  return {
    isDark: isInitialDark,
    toggle: () => {
      const isDark = !get().isDark;
      localStorage.setItem("is-dark", isDark ? "true" : "light mode sucker");
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "garden",
      );
      set({ isDark });
    },
  };
});
