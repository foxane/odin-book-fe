import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { notifService } from "../utils/services";
import useAuth from "../context/AuthContext";

const queryKey = ["notifications"];

export default function useNotification() {
  const user = useAuth((s) => s.user);

  const client = useQueryClient();
  const query = useInfiniteQuery({
    queryKey,
    enabled: !!user,
    initialPageParam: "",
    queryFn: ({ pageParam }) => notifService.getMany(pageParam),
    getNextPageParam: ({ notifications }) => {
      if (notifications.length < 10) return undefined;
      else return notifications.at(-1)?.id.toString();
    },
  });

  const refresh = () => client.invalidateQueries({ queryKey });
  const data = query.data?.pages.map((el) => el.notifications).flat() ?? [];
  const unreadCount = query.data?.pages[0].unreadCount;

  const read = useMutation({
    mutationFn: notifService.read,
    onSettled: () => client.invalidateQueries({ queryKey }),
  });

  const readAll = useMutation({
    mutationFn: notifService.readAll,
    onSettled: () => client.invalidateQueries({ queryKey }),
  });

  return {
    refresh,
    query,
    data,
    unreadCount,
    markAsRead: read.mutate,
    markAllAsRead: readAll.mutate,
  };
}
