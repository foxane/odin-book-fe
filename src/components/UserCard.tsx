import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import useAuth from "../context/AuthContext";

interface Props {
  user: User;
  follow: (user: User) => void;
}

export default function UserCard({ user, follow }: Props) {
  const auth = useAuth();

  return (
    <div className="bg-base-100 border-base-content/20 flex max-w-64 items-center gap-1 rounded-md border p-2">
      <Link to={`/user/${user.id}`}>
        <Avatar
          name={user.name}
          src={user.avatar ?? ""}
          size="30"
          round
          textSizeRatio={2}
        />
      </Link>

      <Link to={`/user/${user.id}`} data-tip={user.name} className="tooltip">
        <p className="truncate text-xs font-semibold">{user.name}</p>
      </Link>

      {auth.user?.id !== user.id && (
        <button
          onClick={() => follow(user)}
          className={twMerge(
            "btn btn-primary btn-xs ms-auto",
            user.isFollowed && "btn-outline",
          )}
        >
          {user.isFollowed ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
