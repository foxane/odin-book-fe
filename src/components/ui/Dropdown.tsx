import { twMerge } from "tailwind-merge";

const Dropdown = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={twMerge("dropdown", props.className)}>{props.children}</div>
  );
};

const DropdownTrigger = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      onClick={() => console.log("clicked")}
      tabIndex={0}
      role="button"
      className={twMerge("cursor-pointer", props.className)}
    >
      {props.children}
    </div>
  );
};

const DropdownContent = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      tabIndex={0}
      className={twMerge(
        "dropdown-content card w-80 bg-base-100 p-1 shadow-2xl",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

export { Dropdown, DropdownTrigger, DropdownContent };
