import { SquirrelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "./user-menu/UserMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 navbar w-full border-b border-neutral bg-base-300/20 backdrop-blur-xs">
      <div className="navbar-start">
        <h1>
          <Link to={"/"} className="flex items-center gap-2 font-serif text-xl">
            <SquirrelIcon size={35} strokeWidth={1.5} />
            Twittard
          </Link>
        </h1>
      </div>

      <div className="navbar-end">
        <UserMenu />
      </div>
    </header>
  );
}
