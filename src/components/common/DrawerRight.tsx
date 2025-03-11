import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../utils/services";
import { DEFAULT_API_CURSOR_LIMIT } from "../../utils/constants";
import UserList from "../user/UserList";

export default function DrawerRight({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="drawer drawer-end lg:drawer-open">
          <input id="right-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page */}
            {children}
          </div>

          <div className="drawer-side z-3 lg:z-1">
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
      </div>
    </div>
  );
}
