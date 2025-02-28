import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Card({ className, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "card hover:border-base-content/40 border-base-content/10 w-full cursor-pointer border p-2 shadow-md transition-colors",
        className,
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}
