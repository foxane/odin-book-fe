import Avatar from "react-avatar";

export default function MessageToast({ msg }: { msg: Message }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1">
      <Avatar
        round
        className="avatar row-span-2"
        name={msg.user.name}
        src={msg.user.avatar ?? ""}
        size="30"
      />
      <p className="text-sm">
        <span className="font-bold">{msg.user.name}</span> sent you a message
      </p>
      <div className="inline-flex truncate text-xs italic opacity-80">
        <p className="truncate">{msg.text}</p>
      </div>
    </div>
  );
}
