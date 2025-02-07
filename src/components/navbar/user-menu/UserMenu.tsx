import { useEffect, useState } from "react";
import MainMenu from "./MainPage";
import PrefMenu from "./PrefPage";
import { Dropdown, DropdownContent, DropdownTrigger } from "../../ui/Dropdown";
import UserAvatar from "../../ui/UserAvatar";
import useAuth from "../../../hooks/useAuth";

export default function UserMenu() {
  const [page, setPage] = useState<Pages>("main");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const move = (page: Pages = "main") => setPage(page);

  useEffect(() => {
    if (!open) setPage("main"); // Go back to main when closed
  }, [open]);

  return (
    <Dropdown className={"dropdown-open dropdown-end"}>
      {/* TODO: PLEASE FIX THE ACCESSIBILTY */}
      {/* Wrapper to make it clickable */}
      <button onClick={() => setOpen(!open)}>
        <DropdownTrigger>
          {user ? <UserAvatar user={user} /> : <span className="loading" />}
        </DropdownTrigger>
      </button>

      {open && (
        <>
          <DropdownContent className="mt-3.5 border border-gray-300 dark:border-gray-600">
            {page === "main" && <MainMenu move={move} />}
            {page === "pref" && <PrefMenu move={move} />}
          </DropdownContent>
          <div
            className="fixed top-0 left-0 h-screen w-full bg-base-300 opacity-20"
            onClick={() => setOpen(false)}
          />
        </>
      )}
    </Dropdown>
  );
}
