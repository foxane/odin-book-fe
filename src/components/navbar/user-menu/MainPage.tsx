import { ChevronRightIcon, LogOutIcon, Settings2Icon } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import UserAvatar from "../../ui/UserAvatar";

export default function MainMenu({ move }: { move: Move }) {
  const { user, logout } = useAuth();

  return (
    <>
      <button className="btn justify-start py-4 btn-ghost">
        <UserAvatar />

        <p className="text-lg">{user?.name}</p>
      </button>

      <div className="divider h-1" />

      <button
        className="btn justify-start btn-ghost"
        onClick={() => move("pref")}
      >
        <Settings2Icon />
        Preferences
        <ChevronRightIcon className="ms-auto" />
      </button>

      <button
        className="btn justify-start btn-ghost"
        onClick={() => {
          const modal = document.getElementById(
            "logout_modal",
          ) as HTMLDialogElement;
          modal.showModal();
        }}
      >
        <LogOutIcon />
        Log Out
      </button>

      <dialog id="logout_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Logout</h3>
          <p className="">Are you sure you want to logout?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Cancel</button>
              <button
                className="btn text-error-content btn-error"
                onClick={logout}
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
