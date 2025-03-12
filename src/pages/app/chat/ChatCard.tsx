import { formatDate } from "../../../utils/helpers";
import UserAvatar from "../../../components/user/UserAvatar";

interface Props {
  chatSummary: ChatSummary;
  handleClick: () => void;
}

function ChatCard({ chatSummary, handleClick }: Props) {
  const { otherUser, lastMessage, unreadCount } = chatSummary;
  return (
    <div
      onClick={handleClick}
      className="card hover:border-base-content/40 border-base-content/10 w-full cursor-pointer border p-2 shadow-md transition-colors"
    >
      <div className="grid grid-cols-[50px_1fr_auto] items-center gap-x-1">
        <UserAvatar user={otherUser} />

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
    </div>
  );
}

export default ChatCard;
