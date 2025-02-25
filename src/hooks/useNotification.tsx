import { useContext } from "react";
import { NotifContext } from "../context/NotifContext";

export default function useNotification() {
  const context = useContext(NotifContext);
  if (!context) throw new Error("useNotification called outside provider");

  return context;
}
