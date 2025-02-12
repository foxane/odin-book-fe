import { HomeIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { userService } from "./utils/services";

export default function App() {
  const { user, logout } = useAuth();
  const { toggleTheme } = useContext(ThemeContext);

  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getMany(),
  });

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
            <button className="btn btn-error btn-outline" onClick={logout}>
              Logout
            </button>
            {user && <div>{user.name}</div>}
          </div>
        </nav>

        <nav className="bg-base-200/50 fixed bottom-0 left-0 z-10 flex w-full border-t backdrop-blur-xl md:hidden">
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

        <main className="border-base-content/10 border-0 border-x px-5 py-5 pb-6">
          <Outlet />
        </main>

        <div className="hidden lg:block">
          {userQuery.data?.map((el) => <div key={el.id}>{el.name}</div>)}
        </div>
      </div>
    </div>
  );
}
