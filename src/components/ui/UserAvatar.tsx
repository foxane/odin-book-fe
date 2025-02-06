import useAuth from "../../hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

export default function UserAvatar() {
  const { user } = useAuth();

  return (
    <Avatar>
      <AvatarImage src={user?.avatar ?? undefined} />
      <AvatarFallback className="bg-primary text-primary-content">
        RTD
      </AvatarFallback>
    </Avatar>
  );
}
