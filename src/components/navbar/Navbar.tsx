import { SquirrelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Dropdown, DropdownTrigger } from "../ui/Dropdown";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 navbar min-h-14 w-full border-b backdrop-blur-sm">
      <div className="navbar-start">
        <h1>
          <Link to={"/"} className="flex items-center gap-2 font-serif text-xl">
            <SquirrelIcon size={35} strokeWidth={1.5} />
            Twittard
          </Link>
        </h1>
      </div>

      <div className="navbar-end">
        {user && (
          <Dropdown className="dropdown-end">
            <DropdownTrigger>
              <Avatar>
                <AvatarImage src={user.avatar ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-content">
                  ND
                </AvatarFallback>
              </Avatar>
            </DropdownTrigger>

            <UserMenu user={user} />
          </Dropdown>
        )}
      </div>
    </header>
  );
}
