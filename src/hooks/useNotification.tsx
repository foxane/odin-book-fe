import { useContext } from "react";
import {
  INotificationContext,
  NotificationContext,
} from "../context/NotificationContext";

export default function useNotification() {
  const context = useContext(NotificationContext) as
    | INotificationContext
    | undefined;
  if (!context) throw new Error("useNotification used outside provider!");

  return context;
}
