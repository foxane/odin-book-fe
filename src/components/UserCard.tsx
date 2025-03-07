import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import useAuth from "../context/AuthContext";
import Card from "./Card";

interface Props {
  user: User;
  follow: (user: User) => void;
}

export default function UserCard({ user, follow }: Props) {
  const authUser = useAuth((s) => s.user);

  return (
    <Card>
      <div className="flex items-center gap-2">
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

        {authUser?.id !== user.id && (
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
    </Card>
  );
}
