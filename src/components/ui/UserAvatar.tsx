import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

export default function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar className="z-0">
      <AvatarImage src={user.avatar ?? undefined} />
      <AvatarFallback className="bg-primary text-primary-content">
        RTD
      </AvatarFallback>
    </Avatar>
  );
}
