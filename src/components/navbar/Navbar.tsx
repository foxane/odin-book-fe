import { BotIcon, MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import NavBtn from "./NavBtn";
import { twMerge } from "tailwind-merge";

function Navbar() {
  const toggleDrawer = (pos: "right" | "left") => {
    const drawerToggle = document.getElementById(
      `${pos}-drawer`,
    ) as HTMLInputElement | null;
    if (drawerToggle) drawerToggle.checked = !drawerToggle.checked;
  };

  return (
    <header
      className={twMerge(
        "bg-base-100/50 border-base-content/20 flex h-16 border-b px-3 backdrop-blur-lg", // Styles
        "z-2 sticky top-0 md:hidden", // Postitioning
      )}
    >
      <div className="navbar-start gap-1">
        <NavBtn
          className="btn-square md:hidden"
          onClick={() => toggleDrawer("left")}
        >
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

      <div className="navbar-end">
        <NavBtn
          className="btn-square lg:hidden"
          onClick={() => toggleDrawer("right")}
        >
          <MenuIcon />
        </NavBtn>
      </div>
    </header>
  );
}

export default Navbar;
