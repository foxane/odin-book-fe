import { HomeIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

export default function App() {
  const { user } = useAuth();
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <div className="bg-base-200">
      <div className="mx-auto grid h-full max-w-7xl md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]">
        <nav className="md:menu sticky top-0 hidden h-screen gap-2">
          <Link to={"/"} className="btn btn-ghost">
            <HomeIcon size={20} />
            Home
          </Link>

          <Link to={"/"} className="btn btn-ghost">
            <UserIcon size={20} />
            Profile
          </Link>

          <div className="mt-auto">
            <button onClick={toggleTheme} className="btn btn-outline">
              Toggle theme
            </button>
            {user && <div>{user.name}</div>}
          </div>
        </nav>

        <nav className="bg-base-200/50 fixed bottom-0 left-0 flex w-full border-t backdrop-blur-xl md:hidden">
          <Link to={"/"} className="btn btn-ghost grow py-6">
            <HomeIcon />
          </Link>
          <Link to={"/"} className="btn btn-ghost grow py-6">
            <UserIcon />
          </Link>
          <Link to={"/"} className="btn btn-ghost grow py-6">
            <SearchIcon />
          </Link>
          <Link to={"/"} className="btn btn-ghost grow py-6">
            <SettingsIcon />
          </Link>
        </nav>

        <main className="border-base-content/30 border-0 border-x px-5">
          <Outlet />
        </main>

        <div className="hidden lg:block">Stuff</div>
      </div>
    </div>
  );
}
