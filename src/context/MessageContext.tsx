import { createContext, useState } from "react";

interface IMessageContext {
  /**
   * Chat list, not sure if i should put messages in here as well
   */
  chatList: Chat[];

  /**
   * Total number of chat that have unread message.
   *  Useful to show in navigation
   */
  unreadChat: number;

  /**
   * Mark all message inside this chat as read
   * @param chatId chat id
   */
  markChatAsRead: (chatId: number) => void;
}

const MessageContext = createContext<IMessageContext | null>(null);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const unreadChat = chatList.reduce(
    (acc, chat) => (chat._count.message > 0 ? acc + 1 : acc),
    0,
  );

  const markChatAsRead = (id: number) => {
    setChatList((prev) =>
      prev.map((el) => (el.id === id ? { ...el, _count: { message: 0 } } : el)),
    );
  };

  return (
    <MessageContext.Provider value={{ chatList, markChatAsRead, unreadChat }}>
      {children}
    </MessageContext.Provider>
  );
};

export { MessageContext, MessageProvider };
