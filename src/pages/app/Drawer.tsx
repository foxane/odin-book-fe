import { Link } from "react-router-dom";
import SearchForm from "../../components/common/SearchForm";
import { HomeIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react";
import useTheme from "../../context/ThemeContext";

function Drawer({ children }: { children: React.ReactNode }) {
  const toggleTheme = useTheme((s) => s.toggle);
  const isDarkTheme = useTheme((s) => s.isDark);

  return (
    <div className="drawer lg:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>

      <div className="drawer-side z-2">
        <label
          htmlFor="main-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        {/* Sidebar content */}
        {/* NOTE: xl:min-h-fit is to prevent overflow-y when 
                  displayed as sidebar. not drawer */}
        <div className="bg-base-100 flex h-full w-64 flex-col space-y-4 p-4 xl:h-[calc(100vh-3.5rem)]">
          <SearchForm className="md:hidden" />

          <nav>
            <ul className="menu w-full">
              <li>
                <Link to={"/"}>
                  <HomeIcon size={20} />
                  Home
                </Link>
              </li>
              <li>
                <Link to={"/"}>
                  <UserIcon size={20} />
                  Profile
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-auto">
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                checked={isDarkTheme}
                onChange={toggleTheme}
              />
              <MoonIcon className="swap-on" />
              <SunIcon className="swap-off" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drawer;
