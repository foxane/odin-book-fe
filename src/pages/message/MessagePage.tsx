import { useEffect, useState } from "react";
import useMessage from "../../hooks/useMessage";
import MessageCard from "./MessageCard";
import MessageRoom from "./MessageRoom";
import { useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";

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
    <div className="flex grow flex-col">
      <section className={twMerge("space-y-3", active && "hidden")}>
        {chatList.map((el) => (
          <MessageCard
            handleClick={() => setActive(el)}
            chatSummary={el}
            key={el.id}
          />
        ))}
      </section>

      {active && (
        <MessageRoom chat={active} closeChat={() => setActive(null)} />
      )}
    </div>
  );
}

export default MessagePage;
