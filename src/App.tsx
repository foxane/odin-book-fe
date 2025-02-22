import { Outlet } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { userService } from "./utils/services";
import UserCard from "./components/UserCard";
import Drawer from "./components/Drawer";
import Navbar from "./components/Navbar";
import useUserInfinite from "./hooks/useUserInfinite";
import { useNotification } from "./hooks/useNotification";

export default function App() {
  const userQuery = useInfiniteQuery({
    queryKey: ["users"],
    initialPageParam: "",
    queryFn: ({ pageParam }) => userService.getMany(pageParam),
    getNextPageParam: (prevPages) =>
      prevPages.length < 10 ? undefined : prevPages.at(-1)?.id.toString(),
  });
  const users = userQuery.data?.pages.flat() ?? [];
  const { follow } = useUserInfinite(["users"]);

  const notifOutlet = useNotification();

  return (
    <div className="bg-base-200">
      <Navbar />
      <div className="mx-auto grid max-w-7xl md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]">
        <Drawer unreadCount={notifOutlet.unreadCount} />

        <main className="border-base-content/10 mt-20 border-0 border-x px-2 pb-6">
          <Outlet context={notifOutlet} />
        </main>

        <div className="hidden h-full space-y-20 px-2 lg:block">
          <section className="sticky top-0 space-y-3 pt-20">
            {users.map((el) => (
              <UserCard follow={follow.mutate} user={el} key={el.id} />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
