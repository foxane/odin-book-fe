import { Link } from "react-router-dom";
import SearchForm from "../../components/common/SearchForm";
import {
  BellIcon,
  Github,
  HomeIcon,
  LogOutIcon,
  MessageSquareIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import useTheme from "../../context/ThemeContext";
import useAuth from "../../context/AuthContext";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import UserAvatar from "../../components/user/UserAvatar";
import { api } from "../../utils/services";
import { DEFAULT_API_CURSOR_LIMIT } from "../../utils/constants";
import UserList from "../../components/user/UserList";

function Drawer({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();

  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const toggleTheme = useTheme((s) => s.toggle);
  const isDarkTheme = useTheme((s) => s.isDark);

  const handleLogout = () => {
    logout();
    client.clear();
  };

  const onlineQuery = useInfiniteQuery({
    queryKey: ["users", "online"],
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      return (
        await api.axios.get<User[]>(`/users?online=true&cursor=${pageParam}`)
      ).data;
    },
    getNextPageParam: (page) => {
      if (page.length < DEFAULT_API_CURSOR_LIMIT) return undefined;
      else return page.at(-1)!.id.toString();
    },
  });

  const offlineQuery = useInfiniteQuery({
    queryKey: ["users", "offline"],
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      return (
        await api.axios.get<User[]>(`/users?online=false&cursor=${pageParam}`)
      ).data;
    },
    getNextPageParam: (page) => {
      if (page.length < DEFAULT_API_CURSOR_LIMIT) return undefined;
      else return page.at(-1)!.id.toString();
    },
  });

  return (
    <div className="drawer md:drawer-open">
      <input id="left-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Right drawer */}
        <div className="drawer drawer-end lg:drawer-open">
          <input id="right-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page */}
            {children}
          </div>

          <div className="drawer-side z-3 lg:z-1 lg:top-16">
            <label htmlFor="right-drawer" className="drawer-overlay"></label>
            <div className="bg-base-100 h-full w-64 space-y-5 p-2">
              <section className="space-y-2">
                <h3 className="divider font-semibold">Online users</h3>
                <UserList query={onlineQuery} queryKey={["users", "online"]} />
              </section>

              <section className="space-y-2">
                <h3 className="divider font-semibold">All users</h3>
                <UserList
                  query={offlineQuery}
                  queryKey={["users", "offline"]}
                />
              </section>
            </div>
          </div>
        </div>
        {/* Right drawer */}
      </div>

      {/* Left drawer */}
      <div className="drawer-side z-3 md:z-1 md:top-16">
        <label
          htmlFor="left-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="bg-base-100 flex h-full w-64 flex-col space-y-4 p-4 md:h-[calc(100vh-3.5rem)]">
          <SearchForm className="md:hidden" />

          <nav>
            <h2 className="divider divider-start font-semibold">Navigations</h2>
            <ul className="menu w-full">
              <li>
                <Link to={"/"}>
                  <HomeIcon size={20} />
                  Home
                </Link>
              </li>
              <li>
                <Link to={"/"}>
                  <BellIcon size={20} />
                  Notifications
                </Link>
              </li>
              <li>
                <Link to={"/"}>
                  <MessageSquareIcon size={20} />
                  Messages
                </Link>
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

export default Drawer;
