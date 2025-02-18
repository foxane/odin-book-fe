import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { createContext } from "react";
import { notifService } from "../utils/services";

export interface INotificationContext {
  query: UseInfiniteQueryResult<InfiniteData<INotification[]>>;
  data: INotification[];
  unreadCount: number;
}

const NotificationContext = createContext<INotificationContext>({
  query: {} as UseInfiniteQueryResult<InfiniteData<INotification[]>>, // type-safe my ass
  data: [],
  unreadCount: 0,
});

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const query = useInfiniteQuery({
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

  return (
    <NotificationContext.Provider value={{ query, data, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
