import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  SearchIcon,
  SquirrelIcon,
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
        <div className="bg-base-100 border-base-content/30 pt-15 flex h-full w-64 flex-col space-y-5 border-r px-2 pb-5 md:pt-5">
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
          <div className="space-y-3">
            <label className="label mx-auto flex w-fit items-center">
              <input
                type="checkbox"
                className="toggle"
                checked={isDark}
                onChange={toggle}
              />
              Dark Mode
            </label>

            {/* User card */}
            <Link
              to={`/user/${user?.id ?? ""}`}
              className="card bg-base-100 border-base-content/20 grid grid-cols-[auto_1fr] gap-x-3 border p-2"
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
              className="btn btn-outline btn-error btn-sm btn-block"
              onClick={handleLogout}
            >
              Logout
              <LogOutIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
