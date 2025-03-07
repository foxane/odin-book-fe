import { Outlet } from "react-router-dom";
import Drawer from "../../components/Drawer";
import Navbar from "../../components/navbar/Navbar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../utils/services";
import { DEFAULT_API_CURSOR_LIMIT as LIMIT } from "../../utils/helpers";
import UserCard from "../../components/user/UserCard";

export default function AppLayout() {
  const userQuery = useInfiniteQuery({
    queryKey: ["users"],
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      return (await api.axios.get<User[]>(`/users?cursor=${pageParam}`)).data;
    },
    getNextPageParam: (page) => {
      if (page.length < LIMIT) return undefined;
      else return page.at(-1)!.id.toString();
    },
  });
  const onlineUsers: User[] = [];
  const offlineUsers: User[] = [];
  userQuery.data?.pages
    .flat()
    .forEach((el) =>
      !el.lastSeen ? onlineUsers.push(el) : offlineUsers.push(el),
    );

  return (
    <div className="mx-auto max-w-7xl">
      <Navbar />
      <Drawer>
        {/* Height is 100vh - navbar height */}
        {/* TODO: create new util class for it */}
        <div className="flex min-h-[calc(100vh-3.5rem)] justify-between gap-2 p-2">
          <main className="w-full pt-5">
            <Outlet />
          </main>

          <aside className="hidden w-64 space-y-5 md:block">
            <div className="sticky top-0 space-y-10 py-5">
              <section className="space-y-2">
                <h3 className="divider font-semibold">
                  Online users{"  "}
                  <span className="badge badge-primary badge-xs">
                    {onlineUsers.length}
                  </span>
                </h3>
                {onlineUsers.map((el) => (
                  <UserCard user={el} key={el.id} />
                ))}
              </section>

              <section className="space-y-2">
                <h3 className="divider font-semibold">
                  All users{"  "}
                  <span className="badge badge-primary badge-xs">
                    {offlineUsers.length}
                  </span>
                </h3>
                {offlineUsers.map((el) => (
                  <UserCard user={el} key={el.id} />
                ))}
              </section>
            </div>
          </aside>
        </div>
      </Drawer>
    </div>
  );
}
