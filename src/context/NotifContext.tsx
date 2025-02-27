import { createContext, useEffect, useState } from "react";
import useAuth from "./AuthContext";
import { notifService } from "../utils/services";

interface INotifContext {
  notification: INotification[];
  unreadCount: number;
  read: (id: number) => void;
  readAll: () => void;
  /**
   * @param unread True = delete unread notif aswell
   */
  clear: (unread?: boolean) => void;
}

const NotifContext = createContext<INotifContext | null>(null);

const NotifProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useAuth((s) => s.socket);

  const [notification, setNotification] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const read = (id: number) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setNotification((prev) =>
      prev.map((el) => (el.id === id ? { ...el, isRead: true } : el)),
    );
    void notifService.read(id);
  };

  const readAll = () => {
    setUnreadCount(0);
    setNotification((prev) => prev.map((el) => ({ ...el, isRead: true })));
    void notifService.readAll();
  };

  const clear = (unread = false) => {
    setUnreadCount(0);
    setNotification((prev) => (!unread ? prev.filter((el) => !el.isRead) : []));
    void notifService.clear(unread);
  };

  /**
   * Listen to new notification
   */
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notif: INotification) => {
      alert(`new notif! from: ${notif.actor.name} with type: ${notif.type} `);
      setNotification((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket]);

  /**
   * Fetch old notification
   */
  useEffect(() => {
    const fetchNotif = async () => {
      console.log("fetching old notification...");
      try {
        const data = await notifService.getMany();
        setNotification(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    void fetchNotif();
  }, []);

  return (
    <NotifContext.Provider
      value={{ clear, notification, read, readAll, unreadCount }}
    >
      {children}
    </NotifContext.Provider>
  );
};

export { NotifContext, NotifProvider };
