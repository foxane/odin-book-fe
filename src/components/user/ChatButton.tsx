import { MessageSquare } from "lucide-react";
import useAuth from "../../context/AuthContext";
import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ChatButton({ targetId }: { targetId: number }) {
  const socket = useAuth((s) => s.socket)!;
  const { chatList } = useChat();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateChat = async () => {
    const existingChat = chatList.find((el) => el.otherUser.id === targetId);
    if (existingChat) return void navigate(`/chat?c=${existingChat.id}`);

    setLoading(true);
    try {
      const newChat = await socket.emitWithAck("createChat", targetId);
      void navigate(`/chat?c=${newChat.id}`);
    } catch (error) {
      toast.error("Failed to create chat room");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleCreateChat}
      className="btn btn-sm btn-primary"
    >
      {loading ? (
        <span className="loading loading-sm" />
      ) : (
        <MessageSquare size={18} />
      )}
      {loading ? "Loading..." : "Direct Message"}
    </button>
  );
}

export default ChatButton;
