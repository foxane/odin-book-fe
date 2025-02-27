import { MessageSquareIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/AuthContext";
import { useState } from "react";
import useMessage from "../../hooks/useMessage";

interface Props {
  targetId: number;
}

function ChatButton({ targetId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { chatList } = useMessage();
  const socket = useAuth((s) => s.socket)!;
  const navigate = useNavigate();

  const handleMessage = async () => {
    const existingChat = chatList.find((c) => c.otherUser.id === targetId);
    if (existingChat) return void navigate(`/message?c=${existingChat.id}`);

    setIsLoading(true);
    try {
      const newChat = await socket.emitWithAck("createChat", targetId);
      setIsLoading(false);
      void navigate(`/message?c=${newChat.id}`);
    } catch (error) {
      console.log(error);
    }
  };

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
