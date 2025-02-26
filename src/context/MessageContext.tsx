import { createContext, useEffect, useState } from "react";
import { api } from "../utils/services";
import useAuth from "./AuthContext";
import { convertToSummary } from "../utils/helper";

interface IMessageContext {
  chatList: ChatSummary[];
  unreadCount: number;
  markChatAsRead: (chatId: number) => void;
}

const MessageContext = createContext<IMessageContext | null>(null);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth((s) => s.user)!;
  const socket = useAuth((s) => s.socket)!;

  const [chatList, setChatList] = useState<ChatSummary[]>([]);
  const unreadCount = chatList.reduce(
    (acc, chat) => (chat.unreadCount > 0 ? acc + 1 : acc),
    0,
  );

  const markChatAsRead = (id: number) => {
    socket.emit("readChat", id);
    setChatList((prev) =>
      prev.map((el) => (el.id === id ? { ...el, _count: { message: 0 } } : el)),
    );
  };

  /**
   * Initial load
   */
  useEffect(() => {
    const fetcher = async () => {
      try {
        const { data } = await api.axios.get<ChatSummary[]>(`/chats`);
        console.log("initial chat summary: ", data);

        setChatList(data);
      } catch (error) {
        console.log("failed to  fetch initial chat data :", error);
      }
    };

    void fetcher();
  }, []);

  /**
   * ========== Socket listeners ===========
   */
  useEffect(() => {
    const handle = (c: Chat) => {
      setChatList((prev) => [...prev, convertToSummary(c, user.id)]);
    };

    socket.on("newChat", handle);
    return () => {
      socket.off("newChat");
    };
  }, [socket, user]);

  return (
    <MessageContext.Provider value={{ chatList, markChatAsRead, unreadCount }}>
      {children}
    </MessageContext.Provider>
  );
};

export { MessageContext, MessageProvider };
