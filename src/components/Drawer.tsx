import {
  BellIcon,
  Github,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  MoonIcon,
  SearchIcon,
  SquirrelIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import useAuth from "../context/AuthContext";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { useTheme } from "../context/ThemeContext";
import { useQueryClient } from "@tanstack/react-query";
import useMessage from "../hooks/useMessage";
import useNotification from "../hooks/useNotification";

export default function Drawer({ children }: { children: React.ReactNode }) {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const client = useQueryClient();
  const { isDark, toggle } = useTheme();
  const { unreadCount: msgCount } = useMessage();
  const { unreadCount: notifCount } = useNotification();

  const handleLogout = () => {
    client.clear();
    logout();
  };

  return (
    <div className="drawer md:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>

      <div className="drawer-side">
        <label
          htmlFor="main-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        {/* pt- add space between navbar and drawer */}
        <div className="bg-base-100 border-base-content/30 pt-15 flex h-full w-64 flex-col space-y-5 border-r px-2 md:pt-5">
          <Link to={"/"} className="hidden md:block">
            <h1 className="flex items-center gap-2 text-xl font-bold">
              <SquirrelIcon size={30} className="stroke-accent" />
              <p>Twittard</p>
            </h1>
          </Link>

          {/* Nav links */}
          <nav className="menu w-full grow space-y-1">
            <li>
              <Link to={"/"}>
                <HomeIcon size={20} /> Home
              </Link>
            </li>
            <li>
              <Link to={`/user/${user?.id ?? ""}`}>
                <UserIcon size={20} /> Profile
              </Link>
            </li>
            <li>
              <Link to={`/search`}>
                <SearchIcon size={20} /> Search
              </Link>
            </li>
            <li>
              <Link to={`/notification`}>
                <BellIcon size={20} /> Notifications
                {notifCount > 0 && (
                  <span className="badge badge-primary badge-sm">
                    {notifCount}
                  </span>
                )}
              </Link>
              <Link to={"/message"}>
                <MailIcon size={20} /> Messages
                {msgCount > 0 && (
                  <span className="badge badge-primary badge-sm">
                    {msgCount}
                  </span>
                )}
              </Link>
            </li>
          </nav>

          {/* Drawer bottom section */}
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-end gap-2">
              <a
                className="opacity-80"
                href="https://github.com/foxane"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
              </a>

              <label className="swap swap-rotate opacity-80">
                <input type="checkbox" checked={isDark} onChange={toggle} />
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
                <Avatar
                  round
                  size="40"
                  className="row-span-2"
                  name={user?.name}
                  src={user?.avatar ?? ""}
                />
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
