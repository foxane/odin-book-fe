import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatServices } from "../../utils/services";
import ChatBubble from "./ChatBubble";
import useAuth from "../../context/AuthContext";
import { ArrowLeft, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useMessage from "../../hooks/useMessage";
import Avatar from "react-avatar";

const updateCache = (oldData: Message[] | undefined, newMsg: Message) => {
  if (!oldData) return [newMsg];
  return [newMsg, ...oldData];
};

interface Props {
  chat: ChatSummary;
  closeChat: () => void;
}

function MessageRoom({ chat, closeChat }: Props) {
  const user = useAuth((s) => s.user)!;
  const socket = useAuth((s) => s.socket)!;
  const { markChatAsRead } = useMessage();
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["messages", chat.id],
    queryFn: () => chatServices.getMany(chat.id),
  });

  /**
   * TODO: Enable sending image
   */
  const { register, handleSubmit } = useForm<{ text: string }>();
  const onSend = async (data: { text: string }) => {
    // Do optimistic update
    const dummy: Message = {
      user,
      userId: user.id,
      id: Date.now(),
      createdAt: new Date(),
      media: [],
      status: "PENDING",
      text: data.text,
    };
    client.setQueryData(["messages", chat.id], (old: Message[] | undefined) =>
      updateCache(old, dummy),
    );

    try {
      const message = await socket.emitWithAck("sendMessage", {
        chatId: chat.id,
        message: data,
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

  return (
    <div className="flex grow flex-col">
      {/* Header */}
      <div className="navbar gap-2">
        <button className="btn btn-square btn-ghost" onClick={closeChat}>
          <ArrowLeft />
        </button>

        <Avatar
          name={chat.otherUser.name}
          src={chat.otherUser.avatar ?? ""}
          round
          size="40"
        />

        <p className="text-md font-semibold">{chat.otherUser.name}</p>
      </div>

      {/* Chat list */}
      <section className="m-1 grow overflow-y-auto">
        {query.isLoading && <span className="loading"></span>}
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
