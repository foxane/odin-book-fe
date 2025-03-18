import { createContext, useCallback, useContext, useEffect } from "react";
import { api } from "../utils/services";
import useAuth from "./AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * Quick documentation sir!
 *
 * This context serves as the central management system for chat-related state:
 * - Stores ChatSummaries (chat previews with last message and unread count)
 * - Listens for and handles real-time socket events
 * - Manages read/unread status for chats
 * - Exposes chat data and functions to components
 */

interface IChatContext {
  /**
   * List of all chat summaries for the current user
   * Each ChatSummary contains basic info about the chat, including:
   * - Chat ID and participants
   * - Last message details
   * - Unread message count
   */
  chatList: ChatSummary[];

  /**
   * Total number of chats with unread messages
   * Derived value calculated from chatList
   */
  unreadCount: number;

  /**
   * Marks a specific chat as read
   * - Updates local state to set unreadCount to 0 for the specified chat
   * - Emits socket event to inform server about read status
   * - Should be called when user opens a chat room
   *
   * @param chatId - ID of the chat to mark as read
   */
  markChatAsRead: (chatId: number) => void;
}

const ChatContext = createContext<IChatContext>({
  chatList: [],
  markChatAsRead: () => {},
  unreadCount: 0,
});

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth((s) => s.user)!;
  const socket = useAuth((s) => s.socket)!;
  const client = useQueryClient();
  const navigate = useNavigate();

  const { data: chatList = [] } = useQuery({
    queryKey: ["chats"],
    queryFn: () =>
      api.axios.get<ChatSummary[]>("/chats").then((res) => res.data),
  });

  const unreadCount = chatList.reduce(
    (a, chat) => (chat.unreadCount > 0 ? a + 1 : a),
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
   * Listen to new Chat, and appending it to chatList
   */
  useEffect(() => {
    const handleNewChat = (c: ChatSummary) => {
      client.setQueryData(["chats"], (prev: ChatSummary[] | undefined) => {
        if (!prev) return [c];
        if (prev.some((chat) => chat.id === c.id)) return prev;
        return [...prev, c];
      });
    };

    socket.on("newChat", handleNewChat);
    return () => {
      socket.off("newChat", handleNewChat);
    };
  }, [socket, user, client]);

  /**
   * New messgae listener
   */
  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      const qKey = ["messages", newMessage.chatId];
      /**
       * Update message list when received new message.
       * Sending message will be handled by emitter component
       */
      if (newMessage.userId !== user.id) {
        client.setQueryData(qKey, (oldMessages: Message[] | undefined) => {
          return oldMessages ? [newMessage, ...oldMessages] : [newMessage];
        });

        const t = toast(<MessageToast msg={newMessage} />, {
          onClick: () => {
            markChatAsRead(newMessage.chatId!);
            toast.dismiss(t);
            void navigate(`/chat?c=${newMessage.chatId!}`);
          },
        });
      }

      /**
       * Update chatlist to reflect the latest message
       */
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

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user, client, markChatAsRead, navigate]);

  /**
   * Other user open a chat room.
   * Mark all sent message as read
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
    <ChatContext.Provider value={{ chatList, markChatAsRead, unreadCount }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => useContext(ChatContext);

// eslint-disable-next-line react-refresh/only-export-components
export { ChatContext, ChatProvider, useChat };

import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";

function MessageToast({ msg }: { msg: Message }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1 hover:cursor-pointer">
      <Avatar
        round
        className="avatar row-span-2"
        name={msg.user.name}
        src={msg.user.avatar ?? ""}
        size="30"
      />
      <p className="text-sm">
        <span className="font-bold">{msg.user.name}</span> sent you a message
      </p>
      <div className="inline-flex truncate text-xs italic opacity-80">
        <p className="truncate">{msg.text}</p>
      </div>
    </div>
  );
}
