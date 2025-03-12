import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { getNotificationUrl } from "../utils/helpers";
import { NOTIFICATION_TEXT } from "../utils/constants";
import { api } from "../utils/services";

interface INotifContext {
  notification: INotification[];
  unreadCount: number;
  read: (id: number) => void;
  readAll: () => void;
  /**
   * @param unread True = delete unread notif aswell
   */
  clear: (unread?: boolean) => void;
  loading: boolean;
}

const NotifContext = createContext<INotifContext>({
  notification: [],
  unreadCount: 0,
  read: () => {},
  readAll: () => {},
  clear: () => {},
  loading: false,
});

const NotifProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useAuth((s) => s.socket);
  const navigate = useNavigate();

  const [notification, setNotification] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);
  const unreadCount = notification.reduce(
    (acc, notif) => (!notif.isRead ? acc + 1 : acc),
    0,
  );

  const read = (id: number) => {
    setNotification((prev) =>
      prev.map((el) => (el.id === id ? { ...el, isRead: true } : el)),
    );

    api.axios.patch(`/notifications/${id}/read`).catch((err: unknown) => {
      console.log("failed TO read nnotif: ", err);
      /**
       * Revert to old state
       */
    });
  };

  const readAll = () => {
    setNotification((prev) => prev.map((el) => ({ ...el, isRead: true })));
    api.axios.patch(`/notifications/read-all`).catch((err: unknown) => {
      console.log("failed TO read all notif: ", err);
      /**
       * Revert to old state
       */
    });
  };

  const clear = (unread = false) => {
    setNotification((prev) => (!unread ? prev.filter((el) => !el.isRead) : []));
    api.axios.delete(`/notifications`).catch((err: unknown) => {
      console.log("failed TO clear notif: ", err);
      /**
       * Revert to old state
       */
    });
  };

  /**
   * Listen to new notification
   */
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notif: INotification) => {
      const text = `${notif.actor.name} ${NOTIFICATION_TEXT[notif.type]}`;
      const url = getNotificationUrl(notif);

      setNotification((prev) => [notif, ...prev]);

      alert(`New notification! text: ${text}, url: ${url}`);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [navigate, socket]);

  /**
   * Fetch old notification
   */
  useEffect(() => {
    const fetchNotif = async () => {
      setLoading(true);
      console.log("fetching old notification...");
      try {
        const { data } = await api.axios.get<{
          notifications: INotification[];
          unreadCount: number;
        }>("/notifications");
        setNotification(data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchNotif();
  }, []);

  return (
    <NotifContext.Provider
      value={{ clear, notification, read, readAll, unreadCount, loading }}
    >
      {children}
    </NotifContext.Provider>
  );
};

const useNotif = () => {
  return useContext(NotifContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { NotifContext, NotifProvider, useNotif };
