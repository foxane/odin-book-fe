import { useState } from "react";
import { useChat } from "../../../context/ChatContext";
import ChatRoom from "./ChatRoom";
import ChatCard from "./ChatCard";

function ChatPage() {
  const { chatList, markChatAsRead } = useChat();
  const [active, setActive] = useState<ChatSummary | null>();

  return (
    <div className="">
      {!active && (
        <section className="space-y-3">
          {chatList.map((el) => (
            <ChatCard
              chatSummary={el}
              key={el.id}
              handleClick={() => {
                markChatAsRead(el.id);
                setActive(el);
              }}
            />
          ))}
        </section>
      )}

      {active && <ChatRoom chat={active} close={() => setActive(null)} />}
    </div>
  );
}

export default ChatPage;
