import { useContext } from "react";

import { SunIcon, MoonIcon } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

export default function ThemeBtn({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`${className ?? ""} btn btn-square`}
      {...props}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
