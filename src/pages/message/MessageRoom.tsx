import { useOutletContext } from "react-router-dom";

function MessageRoom({ chat, user }: { chat: Chat; user: User }) {
  const otherUser = chat.member.find((el) => el.id !== user.id);
  const { msgOutlet } = useOutletContext<OutletContext>();

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = data.get("text");
    console.log(text);
  };

  return (
    <div>
      <p>chatting with {otherUser?.name}</p>

      <ul>
        {chat.message.map((el) => (
          <div key={el.id}>
            <p>{el.text}</p>
          </div>
        ))}
      </ul>

      <form onSubmit={handleSend}>
        <input type="text" name="text" />
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}

export default MessageRoom;
