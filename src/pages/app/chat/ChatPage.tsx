import { useEffect, useState } from "react";
import { useChat } from "../../../context/ChatContext";
import ChatRoom from "./ChatRoom";
import ChatCard from "./ChatCard";
import { useSearchParams } from "react-router-dom";
import LoadingOrEmptyCard from "../../../components/common/LoadingOrEmptyCard";

function ChatPage() {
  const [params, setParams] = useSearchParams();
  const { chatList, markChatAsRead } = useChat();
  const [active, setActive] = useState<ChatSummary | null>(null);

  useEffect(() => {
    const chatId = params.get("c");

    if (chatId) {
      setActive(chatList.find((el) => el.id === Number(chatId)) ?? null);
      setParams();
    }
  }, [chatList, params, setParams]);

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

      {!chatList.length && (
        <div className="space-y-1 text-center">
          <LoadingOrEmptyCard isLoading={false} />
          <p>Go to any user profile to start a conversation.</p>
          <p className="text-sm italic opacity-80">
            To start conversation directly from here is not implemented yet, or
            ever will.
          </p>
        </div>
      )}

      {active && <ChatRoom chat={active} close={() => setActive(null)} />}
    </div>
  );
}

export default ChatPage;
