import {
  BellIcon,
  MenuIcon,
  MessageSquareIcon,
  SquirrelIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import useNotification from "../hooks/useNotification";
import useMessage from "../hooks/useMessage";
import NavbarBtn from "./NavbarBtn";

export default function Navbar() {
  const { unreadCount: notifCount } = useNotification();
  const { unreadCount: msgCount } = useMessage();

  return (
    <div className="navbar border-base-content/30 bg-base-200/50 sticky top-0 z-10 border-b px-5 backdrop-blur-2xl md:hidden">
      <section className="navbar-start gap-x-2">
        <label
          htmlFor="main-drawer"
          className="btn btn-ghost btn-square btn-sm md:hidden"
        >
          <MenuIcon />
        </label>

        <Link to={"/"} className="md:hidden">
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <SquirrelIcon size={30} className="stroke-accent" />
            <p>Twittard</p>
          </h1>
        </Link>
      </section>

      <section className="navbar-end gap-x-2">
        <NavbarBtn to="/message" count={msgCount}>
          <MessageSquareIcon size={18} />
        </NavbarBtn>
        <NavbarBtn to="/notification" count={notifCount}>
          <BellIcon size={18} />
        </NavbarBtn>
      </section>
    </div>
  );
}
