import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  count: number;
  to: string;
}

function NavbarBtn({ children, count, to }: Props) {
  return (
    <Link className="btn btn-ghost btn-sm btn-square relative" to={to}>
      {children}
      {count > 0 && (
        <span
          className={"badge badge-xs badge-primary absolute -right-2 top-0"}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

export default NavbarBtn;
