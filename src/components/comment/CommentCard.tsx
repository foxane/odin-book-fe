import { formatDate } from "../../utils/helpers";
import { EllipsisIcon, HeartIcon, PenBoxIcon, Trash2Icon } from "lucide-react";
import UserAvatar from "../user/UserAvatar";
import { POST_STATUS_TEXT } from "../../utils/constants";
import useAuth from "../../context/AuthContext";
import { twMerge } from "tailwind-merge";

interface Props {
  comment: IComment;
  like: () => void;
  update: () => void;
  delete: () => void;
}

export default function CommentCard({ comment, ...actions }: Props) {
  const currentUser = useAuth((s) => s.user)!;

  const disableAction =
    currentUser.id !== comment.userId || currentUser.role === "GUEST";

  return (
    <div className="mx-2 flex gap-x-3">
      <UserAvatar user={comment.user} />

      <div className="w-full space-y-2">
        <div className="flex space-x-4">
          <p className="space-x-2 text-sm">
            <span className="font-bold">{comment.user.name}</span>
            <span className="label text-xs">
              {formatDate(comment.createdAt)}
            </span>
          </p>
        </div>

        <div
          className="break-all text-sm"
          dangerouslySetInnerHTML={{ __html: comment.text }}
        />

        <div className="mt-2">
          <button onClick={actions.like} className={`btn btn-xs btn-ghost`}>
            <HeartIcon
              size={18}
              className={comment.isLiked ? "stroke-primary fill-primary" : ""}
            />
            {comment._count.likedBy}
          </button>
        </div>
      </div>

      <CommentDropdown
        disabled={disableAction}
        deleteComment={actions.delete}
        update={actions.update}
        status={comment.status}
      />
    </div>
  );
}

function CommentDropdown({
  status,
  update,
  deleteComment,
  disabled,
}: {
  disabled: boolean;
  status?: "create" | "update" | "delete";
  update: () => void;
  deleteComment: () => void;
}) {
  if (status)
    return (
      <p className="text-sm">
        {POST_STATUS_TEXT[status]}
        <span className="loading loading-sm ms-1"></span>
      </p>
    );

  return (
    <div className="dropdown dropdown-end">
      <div className="btn btn-square btn-sm btn-ghost" tabIndex={0}>
        <EllipsisIcon />
      </div>
      <ul
        className="dropdown-content menu menu-sm bg-base-200 rounded-box z-1 border-base-content/10 w-40 space-y-1 border shadow-md"
        tabIndex={0}
      >
        <li className={twMerge(disabled && "menu-disabled")}>
          <button onClick={update} disabled={disabled}>
            <PenBoxIcon size={20} /> Edit
          </button>
        </li>
        <li className={twMerge(disabled && "menu-disabled")}>
          <button onClick={deleteComment} disabled={disabled}>
            <Trash2Icon size={20} /> Delete
          </button>
        </li>
      </ul>
    </div>
  );
}
