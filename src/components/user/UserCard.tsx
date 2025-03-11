import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import useAuth from "../../context/AuthContext";
import { twMerge } from "tailwind-merge";

interface Props {
  user: User;
  follow: () => void;
}

function UserCard({ user, follow }: Props) {
  const authUser = useAuth((s) => s.user)!;
  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    follow();
  };

  return (
    <div className="hover:bg-base-content/10 flex cursor-pointer items-center px-2 py-1 transition-colors">
      <Link
        to={`/user/${user.id}`}
        className="flex items-center gap-2 truncate"
      >
        <UserAvatar user={user} size="30" />
        <p className="truncate text-xs font-semibold">{user.name}</p>
      </Link>

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
