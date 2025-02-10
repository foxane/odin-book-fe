import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { DeleteModal, UpdateModal } from "../ui/Modal";
import {
  EllipsisIcon,
  FlagIcon,
  HeartIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/Dropdown";
import useAuth from "../../hooks/useAuth";
import UserAvatar from "../ui/UserAvatar";
import { formatDate } from "../../lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  comment: IComment;
  action: PostAndCommentAction;
}

function CommentCard({ action, comment, className, ...props }: Props) {
  const { user } = useAuth();
  const [modal, setModal] = useState<"update" | "delete" | null>(null);
  const [dropdown, setDropdown] = useState(false);

  const openModal = (e: "update" | "delete" | null) => {
    setDropdown(false);
    setModal(e);
  };

  return (
    <>
      <div
        className={twMerge(
          "card border border-base-content/20 p-2 shadow-md",
          className,
          comment.isPending && "animate-pulse",
        )}
        {...props}
      >
        {/* ============ HEADER ========== */}
        <div className="flex items-center gap-2">
          <UserAvatar user={comment.user} className="h-6 w-6 text-xs" />
          <p className="text-xs font-bold">{comment.user.name}</p>
          <p className="label text-xs">{formatDate(comment.createdAt)}</p>
          {comment.isPending && (
            <p className="ms-auto label text-xs">
              <span className="loading loading-xs" />
              {comment.status === "create"
                ? "Creating"
                : comment.status === "update"
                  ? "Updating"
                  : "Deleting"}
              ...
            </p>
          )}
        </div>

        {/* ============ CONTENT ========== */}
        <div
          className="grow py-1 text-sm"
          dangerouslySetInnerHTML={{ __html: comment.text }}
        />

        {/* ============ FOOTER ========== */}
        <div className="flex items-center justify-end">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => action.like(comment)}
          >
            <HeartIcon
              size={16}
              className={twMerge(
                comment.isLiked && "fill-primary stroke-primary",
              )}
            />
            {comment._count.likedBy}
          </button>

          <Dropdown className={twMerge("dropdown-open dropdown-end")}>
            <button
              onClick={() => setDropdown(!dropdown)}
              className="btn btn-sm btn-ghost"
            >
              <EllipsisIcon size={16} />
              <DropdownTrigger></DropdownTrigger>
            </button>
            {dropdown && (
              <>
                <DropdownContent className="w-32 gap-1 border border-base-300 bg-base-100 py-4">
                  <button
                    disabled={!!user && user.id !== comment.user.id}
                    className="btn flex btn-block justify-start btn-sm btn-ghost"
                    onClick={() => openModal("update")}
                  >
                    <PencilIcon size={18} /> Edit
                  </button>
                  <button className="btn flex btn-block justify-start btn-sm btn-ghost">
                    <FlagIcon size={18} /> Report
                  </button>
                  <button
                    disabled={!!user && user.id !== comment.user.id}
                    className="btn flex btn-block justify-start btn-sm btn-ghost"
                    onClick={() => openModal("delete")}
                  >
                    <Trash2Icon size={18} /> Delete
                  </button>
                </DropdownContent>
                <div
                  className="fixed top-0 left-0 z-50 h-screen w-full bg-base-300 opacity-20"
                  onClick={() => setDropdown(false)}
                />
              </>
            )}
          </Dropdown>
        </div>
      </div>

      {modal === "delete" && (
        <DeleteModal
          onClose={() => setModal(null)}
          res={comment}
          submit={action.delete}
        />
      )}

      {modal === "update" && (
        <UpdateModal
          onClose={() => setModal(null)}
          res={comment}
          submit={action.update}
        />
      )}
    </>
  );
}

export default CommentCard;
