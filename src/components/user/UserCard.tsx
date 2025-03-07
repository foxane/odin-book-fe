import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";

function UserCard({ user }: { user: User }) {
  return (
    <Link
      to={`/user/${user.id}`}
      className="hover:bg-base-content/10 outline-hidden flex min-w-0 cursor-pointer items-center gap-2 truncate p-2 transition-colors"
    >
      <UserAvatar user={user} size="30" />
      <p className="truncate text-xs font-semibold">{user.name}</p>
    </Link>
  );
}

export default UserCard;
