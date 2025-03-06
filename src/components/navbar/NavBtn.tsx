import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  badgeCount?: number;
}

function NavBtn({ badgeCount, children, className, ...props }: Props) {
  return (
    <button
      className={twMerge("btn btn-square btn-ghost relative p-2", className)}
      {...props}
    >
      {children}
      {badgeCount && (
        <span className="badge badge-xs badge-primary absolute -right-2 -top-2">
          {badgeCount}
        </span>
      )}
    </button>
  );
}

export default NavBtn;
