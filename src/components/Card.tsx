import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Card({ className, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "card bg-base-100 hover:border-base-content/40 w-full cursor-pointer border border-transparent p-2 shadow-md transition-colors",
        className,
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}
