import { MenuIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Navbar({ className, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "navbar bg-base-100/50 border-base-content/20 sticky left-0 top-0 z-10 border-b backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <label htmlFor="main-drawer" className="btn btn-square drawer-button">
        <MenuIcon />
      </label>

      {props.children}
    </div>
  );
}
