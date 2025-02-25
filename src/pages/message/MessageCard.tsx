import Avatar from "react-avatar";
import Card from "../../components/Card";
import useAuth from "../../context/AuthContext";

interface Props {
  chat: Chat;
  onClick: (chat: Chat) => void;
}

function MessageCard({ chat, onClick }: Props) {
  const { user } = useAuth();
  const otherUser = chat.member.find((el) => el.id !== user?.id);

  return (
    <Card onClick={() => onClick(chat)}>
      <div className="grid grid-cols-[50px_1fr_auto] items-center gap-x-2">
        <Avatar
          name={otherUser?.name}
          src={otherUser?.avatar ?? ""}
          round
          className="avatar avatar-online row-span-2"
          size="40"
        />

        <div className="grid grid-rows-2 truncate">
          <p className="font-bold">{otherUser?.name}</p>
          <p className="truncate text-sm">
            {chat.message.length > 0 ? chat.message[0].text : ""}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <p>2 day ago </p>
          <p className="badge badge-primary ms-auto">10</p>
        </div>
      </div>
    </Card>
  );
}

export default MessageCard;
