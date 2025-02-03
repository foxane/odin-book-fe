import { ChevronRightIcon, LogOutIcon, Settings2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { DropdownContent } from "../ui/Dropdown";

export default function UserMenu({ user }: { user: User }) {
  return (
    <DropdownContent>
      <button className="btn justify-start py-4 btn-ghost">
        <Avatar>
          <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-primary text-primary-content">
            ND
          </AvatarFallback>
        </Avatar>

        <p className="text-lg">{user.name}</p>
      </button>

      <div className="divider h-1" />

      <button className="btn justify-start btn-ghost">
        <Settings2Icon />
        Preferences
        <ChevronRightIcon className="ms-auto" />
      </button>

      <button className="btn justify-start btn-ghost">
        <LogOutIcon />
        Log Out
      </button>
    </DropdownContent>
  );
}
