import { useEffect, useState } from "react";
import useAuth from "../context/AuthContext";
import { notifService } from "../utils/services";

export interface IUseNotification {
  notification: INotification[];
  unreadCount: number;
  read: (id: number) => void;
}

/**
 * DOES NOT CALL THIS MORE THAN ONE!!
 *
 * This is only used in App.tsx and passed as outlet context
 *
 * Why not use context?
 * - Context would cause extra re-renders
 * - Redundant WebSocket listeners
 * - Unecessary re-fetching
 */
export const useNotification = (): IUseNotification => {
  const socket = useAuth((s) => s.socket);

  const [notification, setNotification] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const read = (id: number) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setNotification((prev) =>
      prev.map((el) => (el.id === id ? { ...el, isRead: true } : el)),
    );
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

  return { notification, unreadCount, read };
};
