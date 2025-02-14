import { MenuIcon, SquirrelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Navbar({ className, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "navbar bg-base-100/50 border-base-content/20 fixed top-0 z-10 border-b backdrop-blur-md md:z-20",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex w-full items-center gap-2 lg:container">
        <label
          htmlFor="main-drawer"
          className="btn btn-square drawer-button btn-ghost md:hidden"
        >
          <MenuIcon />
        </label>

        <Link to={"/"} className="">
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <SquirrelIcon size={30} className="stroke-accent" />
            <p className="hidden md:block">Twittard</p>
          </h1>
        </Link>

        {props.children}
      </div>
    </div>
  );
}
