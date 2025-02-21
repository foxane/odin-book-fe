import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  SearchIcon,
  SquirrelIcon,
  UserIcon,
} from "lucide-react";
import Avatar from "react-avatar";
import { twMerge } from "tailwind-merge";
import useAuth from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import useNotification from "../hooks/useNotification";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Drawer({ className, ...props }: Props) {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  const { unreadCount } = useNotification();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const client = useQueryClient();

  const handleLogout = () => {
    client.clear();
    logout();
  };

  return (
    <div className={twMerge("drawer md:drawer-open", className)} {...props}>
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        {/* Page Content */}
        {props.children}
      </div>

      <div className="drawer-side z-10">
        {/* Drawer overlay */}
        <label
          htmlFor="main-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        {/* Sidebar content */}
        <div className="menu bg-base-200 h-full w-64 space-y-5 p-4 md:pt-20">
          <Link to={"/"} className="mx-auto block md:hidden">
            <h1 className="flex items-center gap-2 text-xl font-bold">
              <SquirrelIcon size={30} className="stroke-accent" /> Twittard
            </h1>
          </Link>

          {/* Nav links */}
          <nav className="w-full space-y-1">
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
                <span
                  className={twMerge(
                    "badge badge-sm",
                    unreadCount && unreadCount > 0 && "badge-primary",
                  )}
                >
                  {unreadCount}
                </span>
              </Link>
              <Link to={"/message"}>
                <MailIcon size={20} /> Messages
                <span
                  className={twMerge(
                    "badge badge-sm",
                    unreadCount && unreadCount > 0 && "badge-primary",
                  )}
                >
                  {unreadCount}
                </span>
              </Link>
            </li>
          </nav>

          {/* Drawer bottom section */}
          <div className="mt-auto space-y-3">
            <label className="label mx-auto flex w-fit items-center">
              <input
                type="checkbox"
                className="toggle"
                checked={isDark}
                onChange={toggleTheme}
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
