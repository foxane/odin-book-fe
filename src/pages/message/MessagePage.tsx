import { useState } from "react";
import useMessage from "../../hooks/useMessage";
import MessageCard from "./MessageCard";
import MessageRoom from "./MessageRoom";

function MessagePage() {
  const { chatList } = useMessage();
  const [active, setActive] = useState<ChatSummary | null>(null);

  return (
    <div>
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
