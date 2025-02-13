import { HomeIcon, SquirrelIcon, UserIcon } from "lucide-react";
import Avatar from "react-avatar";
import { twMerge } from "tailwind-merge";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Drawer({ className, ...props }: Props) {
  const { user } = useAuth();

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
        <div className="bg-base-300 menu min-h-full w-64 space-y-5 p-4">
          <h1 className="mx-auto flex items-center gap-2 text-xl font-bold">
            <SquirrelIcon size={30} className="stroke-accent" /> Twittard
          </h1>

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
          </nav>

          {/* User card */}
          <div className="card bg-base-100 mt-auto grid grid-cols-[auto_1fr] gap-x-3 p-2">
            <Avatar
              round
              size="40"
              className="row-span-2"
              name={user?.name}
              src={user?.avatar ?? ""}
            />
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="label text-xs">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
