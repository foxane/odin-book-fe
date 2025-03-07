import Avatar, { type ReactAvatarProps } from "react-avatar";
import { twMerge } from "tailwind-merge";

function UserAvatar({
  user,
  size,
  ...props
}: ReactAvatarProps & {
  user: Pick<User, "id" | "avatar" | "name" | "lastSeen">;
}) {
  return (
    <div className="indicator">
      <Avatar
        className={twMerge("avatar", !user.lastSeen && "")}
        size={size ?? "35"}
        name={user.name}
        src={user.avatar ?? ""}
        round
        maxInitials={2}
        textSizeRatio={2}
        {...props}
      />
      {!user.lastSeen && (
        <span className="status-md indicator-item status status-success right-1 top-1"></span>
      )}
    </div>
  );
}

export default UserAvatar;
