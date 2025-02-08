import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user?: User;
}

export default function UserAvatar({ ...props }: Props) {
  return (
    <Avatar className={twMerge("z-0", props.className)}>
      <AvatarImage src={props.user?.avatar ?? undefined} />
      <AvatarFallback className="bg-primary text-primary-content">
        {props.user?.name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
