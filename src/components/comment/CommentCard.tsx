import Avatar from "react-avatar";
import { formatDate } from "../../utils/helpers";
import { HeartIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";

interface Props {
  comment: IComment;
  like: () => void;
}

export default function CommentCard({ comment, like }: Props) {
  return (
    <div className={twMerge("flex gap-2", comment.status && "animate-pulse")}>
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
            {comment.status && (
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
          <button className="btn btn-xs btn-ghost" onClick={like}>
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
    </div>
  );
}
