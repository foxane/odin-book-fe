import { ChevronLeft, MoonIcon, SunIcon } from "lucide-react";
import { DropdownContent } from "../../ui/Dropdown";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

export default function PrefMenu({ move }: { move: Move }) {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <DropdownContent>
      <button
        className="group btn justify-start btn-ghost"
        onClick={() => move("main")}
      >
        <ChevronLeft />
        <span className="opacity-0 transition-opacity group-hover:opacity-100">
          Go back
        </span>
      </button>

      <button className="btn justify-start btn-ghost" onClick={toggleTheme}>
        <label className="swap swap-rotate">
          <input type="checkbox" checked={isDark} readOnly />

          <MoonIcon className="swap-off" />
          <SunIcon className="swap-on" />
        </label>
        {isDark ? "Light Mode" : "Take me to the dark side"}
      </button>
    </DropdownContent>
  );
}
