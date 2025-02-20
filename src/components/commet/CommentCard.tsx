import Avatar from "react-avatar";
import { formatDate } from "../../utils/helper";
import {
  EllipsisIcon,
  FlagIcon,
  HeartIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import useAuth from "../../context/AuthContext";
import { useState } from "react";
import { DeleteModal, UpdateModal } from "../Modal";
import { Link } from "react-router-dom";

interface Props {
  comment: IComment;
  action: {
    like: (comment: IComment) => void;
    update: (comment: IComment) => void;
    delete: (comment: IComment) => void;
  };
}

export default function CommentCard({ comment, action }: Props) {
  const { user } = useAuth();
  const [modal, setModal] = useState<"update" | "delete" | null>(null);

  return (
    <div
      className={twMerge("flex gap-2", comment.isPending && "animate-pulse")}
    >
      <Avatar
        className="mt-0.5"
        name={comment.user.name}
        src={comment.user.avatar ?? ""}
        size="26"
        round
        textSizeRatio={2}
      />

      <div className="bg-base-100 grow rounded p-2">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold">
            <Link to={`/user/${comment.user.id}`}>{comment.user.name}</Link>
          </p>
          <p className="label text-xs">{formatDate(comment.createdAt)}</p>

          <div className="ms-auto flex items-center gap-4">
            {comment.isPending && (
              <p className="ms-auto flex items-center gap-1 text-xs font-semibold">
                <span className="loading loading-xs" />
                {comment.status === "create"
                  ? "Posting"
                  : comment.status === "update"
                    ? "Updating"
                    : "Deletiing"}
                ...
              </p>
            )}
          </div>
        </div>

        <div
          className="px-2 py-2 text-sm"
          dangerouslySetInnerHTML={{ __html: comment.text }}
        />

        <div>
          <button
            className="btn btn-xs btn-ghost"
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
        </div>
      </div>

      {modal === "update" && (
        <UpdateModal
          resource={comment}
          onClose={() => setModal(null)}
          submit={action.update}
        />
      )}

      {modal === "delete" && (
        <DeleteModal
          resource={comment}
          onClose={() => setModal(null)}
          submit={action.delete}
        />
      )}

      <details className="dropdown dropdown-end">
        <summary className="btn btn-square btn-sm btn-ghost ms-auto">
          <EllipsisIcon size={20} />
        </summary>
        <div className="dropdown-content menu bg-base-200 w-30 border-base-content/10 mt-2 space-y-2 border">
          <button
            disabled={!user || user.id !== comment.userId}
            onClick={() => setModal("update")}
            className="btn btn-xs btn-ghost justify-start"
          >
            <PencilIcon size={20} /> Edit
          </button>
          <button className="btn btn-xs btn-ghost justify-start">
            <FlagIcon size={20} /> Report
          </button>
          <button
            disabled={!user || user.id !== comment.userId}
            onClick={() => setModal("delete")}
            className="btn btn-xs btn-ghost justify-start"
          >
            <Trash2Icon size={20} /> Delete
          </button>
        </div>
      </details>
    </div>
  );
}
