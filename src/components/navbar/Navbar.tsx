import { BellIcon, BotIcon, MenuIcon, MessageCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import NavBtn from "./NavBtn";
import SearchForm from "../common/SearchForm";
import { twMerge } from "tailwind-merge";

function Navbar() {
  const toggleDrawer = () => {
    const drawerToggle = document.getElementById(
      "main-drawer",
    ) as HTMLInputElement | null;
    if (drawerToggle) drawerToggle.checked = !drawerToggle.checked;
  };

  return (
    <header
      className={twMerge(
        "bg-base-100/50 border-base-content/20 flex h-16 border-b backdrop-blur-lg", // Styles
        "z-2 container sticky top-0", // Postitioning
      )}
    >
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

        <label
          htmlFor="right-drawer"
          tabIndex={0}
          className="btn btn-square btn-ghost lg:hidden"
        >
          <MenuIcon />
        </label>
      </div>
    </header>
  );
}

export default Navbar;
