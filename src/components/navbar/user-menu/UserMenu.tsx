import { useEffect, useState } from "react";
import MainMenu from "./MainPage";
import PrefMenu from "./PrefPage";
import { Dropdown, DropdownContent, DropdownTrigger } from "../../ui/Dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/Avatar";
import useAuth from "../../../hooks/useAuth";

export default function UserMenu() {
  const { user } = useAuth();
  const [page, setPage] = useState<Pages>("main");
  const [open, setOpen] = useState(false);

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
          <Avatar>
            <AvatarImage src={user?.avatar ?? undefined} />
            <AvatarFallback className="bg-primary text-primary-content">
              RTD
            </AvatarFallback>
          </Avatar>
        </DropdownTrigger>
      </button>

      {open && (
        <DropdownContent className="mt-3.5 border border-gray-300 dark:border-gray-600">
          {page === "main" && <MainMenu move={move} />}
          {page === "pref" && <PrefMenu move={move} />}
        </DropdownContent>
      )}
    </Dropdown>
  );
}
