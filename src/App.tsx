import {
  HomeIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  SquirrelIcon,
  UserIcon,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "./utils/services";
import UserCard from "./components/user/UserCard";
import Avatar from "react-avatar";
import Drawer from "./components/Drawer";
import Navbar from "./components/Navbar";

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
      <Navbar />
      <div className="mx-auto grid h-full max-w-7xl md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]">
        <Drawer />

        <main className="border-base-content/10 border-0 border-x px-5 pb-6">
          <Outlet />
        </main>

        <div className="hidden px-2 lg:block">
          <section className="sticky left-0 top-0">
            {userQuery.data?.map((el) => (
              <UserCard follow={followMutation.mutate} user={el} key={el.id} />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
