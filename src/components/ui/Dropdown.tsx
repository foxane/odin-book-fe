import { twMerge } from "tailwind-merge";

const Dropdown = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={twMerge("dropdown", props.className)}>{props.children}</div>
  );
};

const DropdownTrigger = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
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
      className={twMerge(
        "dropdown-content menu mt-3 w-80 rounded-md bg-base-200 px-1 py-5 shadow-2xl",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

export { Dropdown, DropdownTrigger, DropdownContent };
