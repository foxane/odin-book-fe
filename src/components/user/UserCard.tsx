import UserAvatar from "./UserAvatar";
import useAuth from "../../context/AuthContext";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/helpers";

interface Props {
  user: User;
  follow: () => void;
}

function UserCard({ user, follow }: Props) {
  const navigate = useNavigate();
  const authUser = useAuth((s) => s.user)!;
  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    follow();
  };

  return (
    <div
      data-tip={
        user.lastSeen ? `Last seen ${formatDate(user.lastSeen)}` : "Online"
      }
      onClick={() => navigate(`/user/${user.id}`)}
      className="hover:bg-base-content/10 tooltip flex cursor-pointer items-center px-2 py-1 transition-colors"
    >
      <div className="flex items-center gap-2 truncate">
        <UserAvatar user={user} size="30" />
        <p className="truncate text-xs font-semibold">{user.name}</p>
      </div>

      {authUser.id !== user.id && (
        <button
          className={twMerge(
            "btn btn-xs btn-primary ms-auto",
            user.isFollowed && "btn-outline",
          )}
          onClick={handleFollow}
        >
          {user.isFollowed ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}

export default UserCard;
