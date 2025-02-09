import { twMerge } from "tailwind-merge";
import {
  deleteComment,
  likeComment,
  updateComment,
} from "../../services/comment";
import { useState } from "react";
import { DeletePostModal, UpdatePostModal } from "../post/PostModal";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  comment: IComment;
}

export default function CommentCard({ comment, className, ...props }: Props) {
  const [modal, setModal] = useState<"update" | "delete" | null>(null);

  const handleLike = async () => {
    await likeComment(comment);
  };

  const handleDelete = (c: Post) => {
    deleteComment(c as IComment)
      .then(() => console.log("Deleted"))
      .catch((err: unknown) => console.log(err));
  };

  const handleUpdate = (c: Post) => {
    updateComment(c as IComment)
      .then(() => console.log("Updated"))
      .catch((err: unknown) => console.log(err));
  };

  return (
    <div className={twMerge("", className)} {...props}>
      <div dangerouslySetInnerHTML={{ __html: comment.text }} />
      <button onClick={() => void handleLike()} className="btn">
        Like {comment._count.likedBy}
      </button>

      <button className="btn btn-error" onClick={() => setModal("delete")}>
        Delete
      </button>

      <button className="btn" onClick={() => setModal("update")}>
        Update
      </button>

      {modal === "delete" && (
        <DeletePostModal
          onClose={() => setModal(null)}
          post={comment}
          submit={handleDelete}
        />
      )}

      {modal === "update" && (
        <UpdatePostModal
          onClose={() => setModal(null)}
          post={comment}
          submit={handleUpdate}
        />
      )}
    </div>
  );
}
