import { useContext } from "react";
import { MessageContext } from "../context/MessageContext";

export default function useMessage() {
  const context = useContext(MessageContext);
  if (!context) throw new Error("useMessage called outside provider");

  return context;
}
