import { Link, NavLink } from "react-router-dom";
import {
  BellIcon,
  BotIcon,
  Github,
  HomeIcon,
  LogOutIcon,
  MessageSquareIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import useTheme from "../../context/ThemeContext";
import useAuth from "../../context/AuthContext";
import UserAvatar from "../user/UserAvatar";
import { useQueryClient } from "@tanstack/react-query";
import { useNotif } from "../../context/NotifContext";
import { twMerge } from "tailwind-merge";

function DrawerLeft({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();
  const { unreadCount: unreadNotif, loading: notifLoading } = useNotif();

  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const toggleTheme = useTheme((s) => s.toggle);
  const isDarkTheme = useTheme((s) => s.isDark);

  const handleLogout = () => {
    logout();
    client.clear();
  };
  return (
    <div className="drawer md:drawer-open">
      <input id="left-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side z-3 md:z-1">
        <label
          htmlFor="left-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="bg-base-100 flex h-full w-64 flex-col space-y-4 p-4">
          <Link to={"/"} className="inline-flex font-mono">
            <BotIcon size={30} className="me-1" />
            <h1 className="text-lg/loose font-bold">
              {" "}
              {import.meta.env.VITE_APP_NAME}
            </h1>
          </Link>

          <nav>
            <ul className="menu w-full">
              <li>
                <NavLink to={"/"}>
                  <HomeIcon size={20} />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to={"/search"}>
                  <SearchIcon size={20} />
                  Explore
                </NavLink>
              </li>
              <li>
                <NavLink to={"/notification"}>
                  <BellIcon size={20} />
                  Notifications
                  <span
                    className={twMerge(
                      "badge badge-sm",
                      unreadNotif > 0 && "badge-primary",
                    )}
                  >
                    {notifLoading ? (
                      <span className="loading loading-xs" />
                    ) : (
                      unreadNotif
                    )}
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/message"}>
                  <MessageSquareIcon size={20} />
                  Messages
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Drawer bottom section */}
          <div className="mt-auto space-y-4 py-2">
            <div className="flex items-center justify-end gap-2">
              <a
                className="opacity-80"
                href="https://github.com/foxane/odin-book-fe"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
              </a>

              <label className="swap swap-rotate opacity-80">
                <input
                  type="checkbox"
                  checked={isDarkTheme}
                  onChange={toggleTheme}
                />
                <SunIcon className="swap-on" />
                <MoonIcon className="swap-off" />
              </label>
            </div>

            {/* User card */}
            <div className="border-base-content/40 flex items-center rounded border p-2">
              <Link
                to={`/user/${user?.id ?? ""}`}
                className="grid grow grid-cols-[auto_1fr] gap-x-3"
              >
                <div className="row-span-2">
                  <UserAvatar user={user!} />
                </div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="label text-xs">{user?.email}</p>
              </Link>
              <button
                className="btn btn-outline btn-error btn-sm"
                onClick={handleLogout}
              >
                <LogOutIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawerLeft;
