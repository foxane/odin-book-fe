import { createContext, useCallback, useEffect } from "react";
import { api } from "../utils/services";
import useAuth from "./AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface IMessageContext {
  chatList: ChatSummary[];
  unreadCount: number;
  markChatAsRead: (chatId: number) => void;
}

const MessageContext = createContext<IMessageContext | null>(null);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth((s) => s.user)!;
  const socket = useAuth((s) => s.socket)!;
  const client = useQueryClient();

  const { data: chatList = [] } = useQuery({
    queryKey: ["chats"],
    queryFn: () =>
      api.axios.get<ChatSummary[]>("/chats").then((res) => res.data),
  });

  const unreadCount = chatList.reduce(
    (acc, chat) => (chat.unreadCount > 0 ? acc + 1 : acc),
    0,
  );

  const markChatAsRead = useCallback(
    (id: number) => {
      socket.emit("markChatAsRead", id);
      client.setQueryData(["chats"], (prev: ChatSummary[] | undefined) =>
        prev
          ? prev.map((el) => (el.id === id ? { ...el, unreadCount: 0 } : el))
          : [],
      );
    },
    [client, socket],
  );

  /**
   * New Chat listener
   */
  useEffect(() => {
    const handle = (c: ChatSummary) => {
      console.log("NewCat come: ", c);

      client.setQueryData(["chats"], (prev: ChatSummary[] | undefined) => {
        if (!prev) return [c];
        if (prev.some((chat) => chat.id === c.id)) return prev; // Prevent duplicate
        return [...prev, c];
      });
    };

    socket.on("newChat", handle);
    return () => {
      socket.off("newChat");
    };
  }, [socket, user, client]);

  /**
   * New messgae listener
   */
  useEffect(() => {
    const handle = (newMessage: Message) => {
      // Message room update
      client.setQueryData(
        ["messages", newMessage.chatId],
        (oldMessages: Message[] | undefined) => {
          return oldMessages ? [newMessage, ...oldMessages] : [newMessage];
        },
      );

      // Chatlist update
      client.setQueryData(["chats"], (prev: ChatSummary[] | undefined) => {
        if (!prev) return [];
        return prev.map((el) =>
          el.id === newMessage.chatId
            ? {
                ...el,
                lastMessage: newMessage,
                unreadCount:
                  el.unreadCount + (newMessage.userId === user.id ? 0 : 1),
              }
            : el,
        );
      });
    };

    socket.on("newMessage", handle);
    return () => {
      socket.off("newMessage", handle);
    };
  }, [socket, user, client]);

  /**
   * Other user read the chat
   */
  useEffect(() => {
    const readSentMsg = (chatId: number) => {
      client.setQueryData(
        ["messages", chatId],
        (prev: Message[] | undefined) => {
          if (!prev) return prev;
          return prev.map((el) => ({ ...el, status: "READ" }));
        },
      );
    };

    socket.on("readChat", readSentMsg);
    return () => {
      socket.off("readChat", readSentMsg);
    };
  }, [socket, client]);

  return (
    <MessageContext.Provider value={{ chatList, markChatAsRead, unreadCount }}>
      {children}
    </MessageContext.Provider>
  );
};

export { MessageContext, MessageProvider };
