interface Props {
  chat: ChatSummary;
  closeChat: () => void;
}

function MessageRoom({ chat, closeChat }: Props) {
  const messages = ["lorem", "ipsum"]; // Placeholder for reactquery

  return (
    <div>
      <button className="btn" onClick={closeChat}>
        Exit
      </button>

      <p className="text-xl font-bold">Chatroom with {chat.otherUser.name}</p>

      <section>
        <p className="font-bold">Messages</p>
        <ul>
          {messages.map((el) => (
            <div key={el}>{el}</div>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default MessageRoom;
