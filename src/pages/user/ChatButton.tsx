import { MessageSquareIcon } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useAuth from "../../context/AuthContext";
import { useEffect, useState } from "react";

interface Props {
  target: User;
}

function ChatButton({ target }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { msgOutlet } = useOutletContext<OutletContext>();
  const socket = useAuth((s) => s.socket);
  const navigate = useNavigate();

  const handleMessage = () => {
    const existingChat = msgOutlet.chats.find((c) =>
      c.member.some((m) => m.id === target.id),
    );

    if (existingChat) return void navigate(`/message?c=${existingChat.id}`);

    setIsLoading(true);
    socket?.emit("createChat", target.id);
  };

  useEffect(() => {
    if (!socket) return;

    const handleCreated = (c: Chat) => {
      setIsLoading(false);
      void navigate(`/message?c=${c.id}`);
    };

    socket.on("chatCreated", handleCreated);
    return () => {
      socket.off("chatCreated", handleCreated);
    };
  }, [socket, navigate]);

  return (
    <button
      disabled={isLoading}
      onClick={handleMessage}
      className="btn btn-sm btn-primary"
    >
      {isLoading ? (
        <span className="loading" />
      ) : (
        <MessageSquareIcon size={18} />
      )}
      {isLoading ? "Loading..." : "Direct Message"}
    </button>
  );
}

export default ChatButton;
