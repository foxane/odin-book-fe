import Avatar from "react-avatar";
import Card from "../../components/Card";
import { formatDate } from "../../utils/helper";

interface Props {
  chatSummary: ChatSummary;
  handleClick: () => void;
}

function MessageCard({ chatSummary, handleClick }: Props) {
  const { lastMessage, otherUser, unreadCount } = chatSummary;

  return (
    <Card onClick={handleClick}>
      <div className="grid grid-cols-[50px_1fr_auto] items-center gap-x-2">
        <Avatar
          name={otherUser.name}
          src={otherUser.avatar ?? ""}
          className="avatar row-span-2"
          size="40"
          round
        />

        <div className="truncate">
          <p className="font-semibold">{otherUser.name}</p>
          {lastMessage && (
            <p className="truncate text-sm opacity-80">{lastMessage.text}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 text-xs">
          {lastMessage && <p>{formatDate(lastMessage.createdAt)}</p>}
          {unreadCount > 0 && (
            <p className="badge badge-primary ms-auto">{unreadCount}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default MessageCard;
