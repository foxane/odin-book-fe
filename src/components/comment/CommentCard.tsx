import { formatDate } from "../../utils/helpers";
import { EllipsisIcon, HeartIcon, PenBoxIcon, Trash2Icon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import UserAvatar from "../user/UserAvatar";
import { POST_STATUS_TEXT } from "../../utils/constants";

interface Props {
  comment: IComment;
  like: () => void;
  update: () => void;
  delete: () => void;
}

export default function CommentCard({ comment, ...actions }: Props) {
  return (
    <div
      className={twMerge(
        "chat chat-start card w-full space-y-1 p-2",
        comment.status && "animate-pulse",
      )}
    >
      <div className="chat-image">
        <UserAvatar user={comment.user} />
      </div>

      <div className="chat-header w-full items-center gap-3">
        <p className="font-semibold">{comment.user.name}</p>
        <p>{formatDate(comment.createdAt)}</p>
        {comment.status ? (
          <p className="ms-auto text-sm">
            {POST_STATUS_TEXT[comment.status]}
            <span className="loading loading-sm ms-1"></span>
          </p>
        ) : (
          <div className="dropdown dropdown-end ms-auto">
            <div className="btn btn-square btn-sm btn-ghost" tabIndex={0}>
              <EllipsisIcon />
            </div>
            <ul
              className="dropdown-content menu menu-sm bg-base-200 rounded-box z-1 border-base-content/10 w-40 space-y-1 border shadow-md"
              tabIndex={0}
            >
              <li>
                <button onClick={actions.update}>
                  <PenBoxIcon size={20} /> Edit
                </button>
              </li>
              <li>
                <button onClick={actions.delete}>
                  <Trash2Icon size={20} /> Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="p-2 text-sm">
        <div dangerouslySetInnerHTML={{ __html: comment.text }}></div>
      </div>

      <div className="chat-footer">
        <button className="btn btn-ghost btn-xs" onClick={actions.like}>
          <HeartIcon
            size={16}
            className={comment.isLiked ? "fill-primary stroke-primary" : ""}
          />
          {comment._count.likedBy}
        </button>
      </div>
    </div>
  );
}
