import { twMerge } from "tailwind-merge";
import { Check, CheckCheck, Clock } from "lucide-react";
import { formatDate } from "../../../utils/helpers";

interface Props {
  msg: Message;
  isSent: boolean;
}

function ChatBubble({ msg, isSent }: Props) {
  return (
    <div
      className={twMerge("chat space-y-1", isSent ? "chat-end" : "chat-start")}
    >
      <div className={twMerge("chat-bubble", isSent && "chat-bubble-primary")}>
        {msg.text}
      </div>
      <div className="chat-footer tooltip space-x-2" data-tip={msg.status}>
        {msg.status !== "PENDING" && (
          <p className="opacity-80">{formatDate(msg.createdAt)}</p>
        )}

        {isSent &&
          (msg.status === "UNREAD" ? (
            <Check size={16} />
          ) : msg.status === "READ" ? (
            <CheckCheck size={16} />
          ) : (
            <Clock size={16} />
          ))}
      </div>
    </div>
  );
}

export default ChatBubble;
