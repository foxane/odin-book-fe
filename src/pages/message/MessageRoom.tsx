import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import Avatar from "react-avatar";
import { SubmitHandler, useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { chatServices } from "../../utils/services";

interface Props {
  chat: Chat;
  user: Pick<User, "id" | "name" | "avatar">;
  handleClose: () => void;
}

interface Fields {
  text: string;
  image?: File;
}

function MessageRoom({ chat, user, handleClose }: Props) {
  const otherUser = chat.member.find((el) => el.id !== user.id)!;
  const { msgOutlet } = useOutletContext<OutletContext>();
  const { register, handleSubmit } = useForm<Fields>();

  const onSubmit: SubmitHandler<Fields> = (data) => {
    console.log(data);
    msgOutlet.sendMessage({
      targetId: otherUser.id,
      chatId: chat.id,
      message: { text: data.text },
    });
  };

  const msgQuery = useQuery({
    queryKey: ["messages", chat.id],
    queryFn: () => chatServices.getMany(chat.id),
  });

  return (
    <div className="bg-base-100">
      <div className="divider">Chatting with {otherUser.name}</div>

      <button className="btn" onClick={handleClose}>
        <XIcon />
      </button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("text", { required: true })} className="input" />
        <button className="btn btn-primary">Send</button>
      </form>

      <ul>
        {msgQuery.data?.map((el) => (
          <div
            className={twMerge(
              "chat",
              otherUser.id === el.user.id ? "chat-start" : "chat-end",
            )}
            key={el.id}
          >
            <Avatar
              className="chat-image"
              src={el.user.avatar ?? ""}
              name={el.user.name}
              round
              size="40"
            />

            <div
              className={twMerge(
                "chat-bubble",
                otherUser.id !== el.user.id && "chat-bubble-primary",
              )}
            >
              <p>{el.text}</p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default MessageRoom;
