import { SquirrelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "./user-menu/UserMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 navbar w-full border-b border-neutral bg-base-100/60 backdrop-blur-xs md:px-7">
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
