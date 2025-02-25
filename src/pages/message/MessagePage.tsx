import useAuth from "../../context/AuthContext";
import { PlusCircleIcon } from "lucide-react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import MessageCard from "./MessageCard";
import { useEffect, useState } from "react";
import MessageRoom from "./MessageRoom";

function MessagePage() {
  const user = useAuth((s) => s.user)!;
  const { msgOutlet } = useOutletContext<OutletContext>();
  const [params, setParams] = useSearchParams();

  const [active, setActive] = useState<Chat | null>(null);

  useEffect(() => {
    if (!params.has("c")) return;
    const chatId = Number(params.get("c"));

    const chat = msgOutlet.chats.find((el) => el.id === chatId);
    setActive(chat ?? null);
    setParams();
  }, [msgOutlet, params, setParams]);

  return (
    <div>
      <div className="flex justify-between p-2">
        <h1 className="text-xl font-semibold">Messages</h1>
        <button className="btn btn-square btn-primary">
          <PlusCircleIcon />
        </button>
      </div>

      <section className="space-y-3">
        {msgOutlet.chats.map((el) => (
          <MessageCard chat={el} key={el.id} onClick={setActive} />
        ))}
      </section>

      {active && (
        <MessageRoom
          chat={active}
          user={user}
          handleClose={() => setActive(null)}
        />
      )}
    </div>
  );
}

export default MessagePage;
