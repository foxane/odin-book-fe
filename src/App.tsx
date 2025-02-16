import { Outlet } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "./utils/services";
import UserCard from "./components/user/UserCard";
import Drawer from "./components/Drawer";
import Navbar from "./components/Navbar";

const usersKey = ["users"];

export default function App() {
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
    <div className="bg-base-200 h-screen">
      <Navbar />
      <div className="mx-auto grid max-w-7xl md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]">
        <Drawer />

        <main className="border-base-content/10 mt-20 border-0 border-x px-2 pb-6">
          <Outlet />
        </main>

        <div className="hidden h-full space-y-20 px-2 lg:block">
          <section className="sticky top-0 space-y-3 pt-20">
            {userQuery.data?.map((el) => (
              <UserCard follow={followMutation.mutate} user={el} key={el.id} />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
