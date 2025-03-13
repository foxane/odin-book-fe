import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useAuth from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import { api } from "../../../utils/services";
import MessageDummy from "../../../classes/Message";
import ChatBubble from "./ChatBubble";
import LoadingOrEmptyCard from "../../../components/common/LoadingOrEmptyCard";
import { formatDate } from "../../../utils/helpers";
import Avatar from "react-avatar";

const updateCache = (oldData: Message[] | undefined, newMsg: Message) => {
  if (!oldData) return [newMsg];
  return [newMsg, ...oldData];
};

interface Props {
  chat: ChatSummary;
  close: () => void;
}

function MessageRoom({ chat, close }: Props) {
  const user = useAuth((s) => s.user)!;
  const socket = useAuth((s) => s.socket)!;
  const { markChatAsRead } = useChat();
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["messages", chat.id],
    queryFn: () =>
      api.axios
        .get<Message[]>(`/chat/${chat.id}/messages`)
        .then((res) => res.data),
  });
  const msgList = query.data ?? [];

  /**
   * TODO: Enable sending image
   */
  const { register, handleSubmit } = useForm<{ text: string }>();
  const onSend = async ({ text }: { text: string }) => {
    // Do optimistic update
    const dummy: Message = new MessageDummy(text, chat.id, user);

    client.setQueryData(["messages", chat.id], (old: Message[] | undefined) =>
      updateCache(old, dummy),
    );

    try {
      const message = await socket.emitWithAck("sendMessage", {
        chatId: chat.id,
        message: { text },
      });
      client.setQueryData(["messages", chat.id], (old: Message[]) =>
        old.map((el) => (el.id === dummy.id ? message : el)),
      );
    } catch (error) {
      // Send failed
      console.log(error);
    }
  };

  /**
   * Mark as read on load
   */
  useEffect(() => {
    if (chat.unreadCount > 0) markChatAsRead(chat.id);
  }, [chat, markChatAsRead]);

  /**
   * Mark as read when other user read the chat that is currently open
   */
  useEffect(() => {
    const readMessage = (id: number) => {
      if (id === chat.id) markChatAsRead(id);
    };

    socket.on("readChat", readMessage);
    return () => {
      socket.off("readChat", readMessage);
    };
  }, [chat.id, socket, markChatAsRead]);

  /**
   * Try to check if user online from cache
   * Then use lastSeen from ChatSummary if not found
   */
  const lastSeen =
    client
      .getQueryData<InfiniteUser>(["users", "online"])
      ?.pages.flat()
      .find((u) => u.id === chat.otherUser.id)?.lastSeen ??
    chat.otherUser.lastSeen;

  return (
    <div className="flex h-[calc(100vh-5rem)] grow flex-col md:h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="navbar gap-2">
        <button className="btn btn-square btn-ghost" onClick={close}>
          <ArrowLeft />
        </button>

        <Avatar
          name={chat.otherUser.name}
          src={chat.otherUser.avatar ?? ""}
          size="40"
          className="avatar"
          round
        />

        <div className="flex flex-col">
          <p className="font-semibold">{chat.otherUser.name}</p>
          {lastSeen === null ? (
            <span className="text-sm">online</span>
          ) : (
            <p className="validator-hint opacity-80">{formatDate(lastSeen)}</p>
          )}
        </div>
      </div>

      {/* Chat list */}
      <section className="m-1 flex grow flex-col-reverse overflow-y-auto">
        {msgList.length === 0 && (
          <LoadingOrEmptyCard isLoading={query.isLoading} />
        )}
        {query.data?.map((el) => (
          <ChatBubble isSent={user.id === el.userId} msg={el} key={el.id} />
        ))}
      </section>

      {/* input */}
      <form className="flex gap-2 px-5 py-2" onSubmit={handleSubmit(onSend)}>
        <textarea
          className="input input-primary input-lg w-full"
          {...register("text", { required: true })}
        />
        <button type="submit" className="btn btn-primary btn-square">
          <Send />
        </button>
      </form>
    </div>
  );
}

export default MessageRoom;
