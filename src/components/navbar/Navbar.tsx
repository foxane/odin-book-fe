import {
  BellIcon,
  BotIcon,
  MenuIcon,
  MessageCircleIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import NavBtn from "./NavBtn";
import SearchForm from "../common/SearchForm";

function Navbar() {
  const toggleDrawer = () => {
    const drawerToggle = document.getElementById(
      "main-drawer",
    ) as HTMLInputElement | null;
    if (drawerToggle) drawerToggle.checked = !drawerToggle.checked;
  };

  return (
    <header className="bg-base-100/30 border-base-content/20 flex h-14 border-b backdrop-blur-lg">
      <div className="navbar-start gap-1">
        <NavBtn className="btn-square lg:hidden" onClick={toggleDrawer}>
          <MenuIcon />
        </NavBtn>

        <Link to={"/"} className="inline-flex font-mono">
          <BotIcon size={30} className="me-1" />
          <h1 className="text-lg/loose font-bold">
            {" "}
            {import.meta.env.VITE_APP_NAME}
          </h1>
        </Link>
      </div>

      <div className="md:navbar-center hidden">
        <SearchForm />
      </div>

      <div className="navbar-end gap-1">
        <NavBtn>
          <MessageCircleIcon />
        </NavBtn>

        <NavBtn>
          <BellIcon />
        </NavBtn>

        <NavBtn>
          <UserIcon />
        </NavBtn>
      </div>
    </header>
  );
}

export default Navbar;
