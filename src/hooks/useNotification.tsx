import { useInfiniteQuery } from "@tanstack/react-query";
import { notifService } from "../utils/services";
import useAuth from "./useAuth";

export default function useNotification() {
  const { user } = useAuth();
  const query = useInfiniteQuery({
    enabled: !!user,
    queryKey: ["notifications"],
    initialPageParam: "",
    queryFn: ({ pageParam }) => notifService.getMany(pageParam),
    getNextPageParam: (prevPage) => {
      if (prevPage.length < 10) return undefined;
      else return prevPage.at(-1)?.id.toString();
    },
  });
  const data = query.data?.pages.flat() ?? [];
  const unreadCount = data.reduce((acc, el) => (!el.isRead ? ++acc : acc), 0);

  return { query, data, unreadCount };
}
