import { useState } from "react";
import MainMenu from "./MainPage";
import PrefMenu from "./PrefPage";
import { Dropdown, DropdownTrigger } from "../../ui/Dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/Avatar";
import useAuth from "../../../hooks/useAuth";

export default function UserMenu() {
  const { user } = useAuth();
  const [page, setPage] = useState<Pages>("main");
  const [open, setOpen] = useState(false);

  const move = (page: Pages = "main") => setPage(page);

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
        <>
          {page === "main" && <MainMenu move={move} />}
          {page === "pref" && <PrefMenu move={move} />}
        </>
      )}
    </Dropdown>
  );
}
