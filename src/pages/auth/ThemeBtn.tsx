import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeBtn({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const isDark = useTheme((s) => s.isDark);
  const toggle = useTheme((s) => s.toggle);

  return (
    <button
      onClick={toggle}
      className={`${className ?? ""} btn btn-square`}
      {...props}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
