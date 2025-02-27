import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatServices } from "../../utils/services";
import ChatBubble from "./ChatBubble";
import useAuth from "../../context/AuthContext";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useMessage from "../../hooks/useMessage";

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
    <div className="mb-15">
      <button className="btn btn-outline" onClick={closeChat}>
        Exit
      </button>

      <section className="flex flex-col-reverse space-y-2">
        {query.isLoading && <span className="loading"></span>}
        {query.data?.map((el) => (
          <ChatBubble isSent={user.id === el.userId} msg={el} key={el.id} />
        ))}
      </section>

      <form
        className="fixed bottom-0 flex w-full px-5"
        onSubmit={handleSubmit(onSend)}
      >
        <textarea
          className="textarea"
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
