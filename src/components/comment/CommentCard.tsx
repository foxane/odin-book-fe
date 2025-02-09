import { twMerge } from "tailwind-merge";
import { useState } from "react";
import UserAvatar from "../ui/UserAvatar";
import { formatDate } from "../../lib/utils";
import { DeleteModal, UpdateModal } from "../ui/Modal";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  comment: IComment;
  action: PostAndCommentAction;
}

export default function CommentCard({
  action,
  comment,
  className,
  ...props
}: Props) {
  const [modal, setModal] = useState<"update" | "delete" | null>(null);

  return (
    <div
      className={twMerge(
        "border p-5",
        className,
        comment.isPending && "animate-pulse",
      )}
      {...props}
    >
      <div className="card-title">
        <UserAvatar user={comment.user} />
        <p>{formatDate(comment.createdAt)}</p>
        <p>{comment.isPending}</p>
        <p>{comment.status}</p>
      </div>

      <div dangerouslySetInnerHTML={{ __html: comment.text }} />

      <button onClick={() => action.like(comment)} className="btn">
        Like {comment._count.likedBy}
      </button>

      <button className="btn btn-error" onClick={() => setModal("delete")}>
        Delete
      </button>

      <button className="btn" onClick={() => setModal("update")}>
        Update
      </button>

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
    </div>
  );
}
