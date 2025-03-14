import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/services";
import { DEFAULT_API_CURSOR_LIMIT } from "../../utils/constants";
import { useEffect } from "react";
import useAuth from "../../context/AuthContext";
import UserCard from "../user/UserCard";
import UserSkeleton from "../user/UserSkeleton";
import useUserInfinite from "../../hooks/useUserInfinite";

export default function DrawerRight({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = useAuth((s) => s.socket);
  const client = useQueryClient();

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

  /**
   * Handle user connect
   */
  useEffect(() => {
    if (!socket) return;
    const handleUserConnected = (user: Partial<User>) => {
      /**
       * Remove from offline data if exist
       */
      client.setQueryData(
        ["users", "offline"],
        (old: InfiniteUser | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.filter((u) => u.id !== user.id),
            ),
          };
        },
      );

      /**
       * Add to online data if not exist
       */
      const exist = onlineQuery.data?.pages
        .flat()
        .find((u) => u.id === user.id);
      if (exist) return;

      client.setQueryData(
        ["users", "online"],
        (old: InfiniteUser | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: [[user as User, ...old.pages[0], ...old.pages.slice(1)]],
          };
        },
      );
    };

    socket.on("userConnected", handleUserConnected);

    return () => {
      socket.off("userConnected", handleUserConnected);
    };
  }, [client, onlineQuery.data?.pages, socket]);

  /**
   * Handle user disconnect
   * Basically the same as user connected, but reversed querykey
   */
  useEffect(() => {
    if (!socket) return;

    const handleUserDisconnect = (user: Partial<User>) => {
      /**
       * Remove from online data if exist
       */
      client.setQueryData(
        ["users", "online"],
        (old: InfiniteUser | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.filter((u) => u.id !== user.id),
            ),
          };
        },
      );

      /**
       * Add to offline data if not exist
       */
      const exist = offlineQuery.data?.pages
        .flat()
        .find((u) => u.id === user.id);
      if (exist) return;

      client.setQueryData(
        ["users", "offline"],
        (old: InfiniteUser | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: [[user as User, ...old.pages[0], ...old.pages.slice(1)]],
          };
        },
      );
    };

    socket.on("userDisconnected", handleUserDisconnect);

    return () => {
      socket.off("userDisconnected", handleUserDisconnect);
    };
  }, [client, offlineQuery.data?.pages, socket]);

  const onlines = onlineQuery.data?.pages.flat() ?? [];
  const offlines = offlineQuery.data?.pages.flat() ?? [];
  const { follow: onlineFollow } = useUserInfinite(["users", "online"]);
  const { follow: offlineFollow } = useUserInfinite(["users", "offline"]);

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
                <section className="space-y-1">
                  {onlines.map((el) => (
                    <UserCard
                      user={el}
                      key={el.id}
                      follow={() => {
                        onlineFollow.mutate(el);
                        console.log("hi");
                      }}
                    />
                  ))}

                  {onlines.length === 0 &&
                    onlineQuery.isPending &&
                    Array(3)
                      .fill("")
                      .map((_, i) => <UserSkeleton key={i} />)}
                </section>
              </section>

              <section className="space-y-2">
                <h3 className="divider font-semibold">All users</h3>
                <section className="space-y-1">
                  {offlines.map((el) => (
                    <UserCard
                      user={el}
                      key={el.id}
                      follow={() => {
                        offlineFollow.mutate(el);
                        console.log("hi");
                      }}
                    />
                  ))}

                  {offlines.length === 0 &&
                    offlineQuery.isPending &&
                    Array(3)
                      .fill("")
                      .map((_, i) => <UserSkeleton key={i} />)}
                </section>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
