import { useEffect, useState } from "react";
import useMessage from "../../hooks/useMessage";
import MessageCard from "./MessageCard";
import MessageRoom from "./MessageRoom";
import { useSearchParams } from "react-router-dom";

function MessagePage() {
  const [params, setParams] = useSearchParams();
  const { chatList } = useMessage();
  const [active, setActive] = useState<ChatSummary | null>(null);

  useEffect(() => {
    const chatId = params.get("c");

    if (chatId) {
      setActive(chatList.find((el) => el.id === Number(chatId)) ?? null);
      setParams();
    }
  }, [chatList, params, setParams]);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Messages</h2>

      {chatList.map((el) => (
        <MessageCard
          handleClick={() => setActive(el)}
          chatSummary={el}
          key={el.id}
        />
      ))}

      {active && (
        <MessageRoom chat={active} closeChat={() => setActive(null)} />
      )}
    </div>
  );
}

export default MessagePage;
