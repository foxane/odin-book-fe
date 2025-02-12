import { HomeIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "./utils/services";
import UserCard from "./components/user/UserCard";

const usersKey = ["users"];

export default function App() {
  const { user, logout } = useAuth();
  const { toggleTheme } = useContext(ThemeContext);

  const client = useQueryClient();
  const userQuery = useQuery({
    queryKey: usersKey,
    queryFn: () => userService.getMany(),
  });
  const followMutation = useMutation({
    mutationFn: userService.follow,
    onMutate: async (toFollow) => {
      await client.cancelQueries({ queryKey: usersKey });
      const prev = client.getQueryData(usersKey);

      client.setQueryData(usersKey, (old: User[] | undefined) =>
        old
          ? old.map((el) =>
              el.id !== toFollow.id ? el : { ...el, isFollowed: true },
            )
          : old,
      );

      return { prev };
    },
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(usersKey, ctx.prev),
    onSettled: () => client.invalidateQueries({ queryKey: usersKey }),
  });

  return (
    <div className="bg-base-200">
      <div className="mx-auto grid h-full max-w-7xl md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]">
        <nav className="md:menu sticky top-0 hidden h-screen gap-2">
          <Link to={"/"} className="btn btn-ghost">
            <HomeIcon size={20} />
            Home
          </Link>

          <Link to={`/user/${user!.id}`} className="btn btn-ghost">
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
          <Link to={`/user/${user!.id}`} className="btn btn-ghost grow py-6">
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

        <div className="hidden space-y-2 lg:block">
          {userQuery.data?.map((el) => (
            <UserCard follow={followMutation.mutate} user={el} key={el.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
