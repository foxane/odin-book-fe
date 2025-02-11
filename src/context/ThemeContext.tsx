import { createContext, ReactNode, useEffect, useState } from "react";

const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("is-dark") === "true",
  );

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    localStorage.setItem("is-dark", isDark ? "true" : "light mode sucker");
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "garden",
    );
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
