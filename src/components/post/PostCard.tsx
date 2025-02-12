import Avatar from "react-avatar";
import { formatDate } from "../../utils/helper";
import {
  EllipsisIcon,
  FlagIcon,
  HeartIcon,
  MessageSquareIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { DeleteModal, UpdateModal } from "../Modal";
import { twMerge } from "tailwind-merge";
import useAuth from "../../hooks/useAuth";

interface Props {
  post: Post;
  action: {
    update: (p: Post) => void;
    delete: (p: Post) => void;
    like: (p: Post) => void;
  };
}

function PostCard({ post, action }: Props) {
  const { user } = useAuth();
  const [modal, setModal] = useState<"update" | "delete" | null>(null);

  return (
    <div
      className={twMerge(
        "bg-base-100 card flex flex-col p-2",
        post.isPending && "animate-pulse",
      )}
    >
      <div className="border-base-content/10 card-title border-b pb-1">
        <Link
          to={`/user/${post.user.id}`}
          className="grid grid-cols-[auto_1fr] gap-x-3 rounded p-1"
        >
          <Avatar
            className="row-span-2"
            name={post.user.name}
            src={post.user.avatar ?? ""}
            size="1.7rem"
            textSizeRatio={2}
            round
          />
          <p className="text-xs font-semibold">{post.user.name}</p>
          <p className="label text-xs">{formatDate(post.createdAt)}</p>
        </Link>

        <div className="ms-auto flex items-center gap-2">
          {post.isPending && (
            <p className="text-xs font-semibold">
              <span className="loading loading-xs me-2" />
              {post.status === "create"
                ? "Posting"
                : post.status === "update"
                  ? "Updating"
                  : "Deleting"}
              ...
            </p>
          )}

          <details className="dropdown dropdown-end">
            <summary className="btn btn-ghost btn-square">
              <EllipsisIcon />
            </summary>
            <div className="dropdown-content menu bg-base-200 w-30 mt-2 space-y-2">
              <button
                disabled={!user || user.id !== post.userId}
                onClick={() => setModal("update")}
                className="btn btn-sm btn-ghost justify-start"
              >
                <PencilIcon size={20} /> Edit
              </button>
              <button className="btn btn-sm btn-ghost justify-start">
                <FlagIcon size={20} /> Report
              </button>
              <button
                disabled={!user || user.id !== post.userId}
                onClick={() => setModal("delete")}
                className="btn btn-sm btn-ghost justify-start"
              >
                <Trash2Icon size={20} /> Delete
              </button>
            </div>
          </details>
        </div>
      </div>

      <div
        className="p-2 text-sm"
        dangerouslySetInnerHTML={{ __html: post.text }}
      />

      <div className="mt-2">
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => action.like(post)}
        >
          <HeartIcon
            size={20}
            className={twMerge(post.isLiked && "fill-primary stroke-primary")}
          />
          {post._count.likedBy}
        </button>

        <Link
          to={`/post/${post.id.toString()}`}
          className="btn btn-ghost btn-sm"
        >
          <MessageSquareIcon size={20} />
          {post._count.comment}
        </Link>
      </div>

      {modal === "delete" && (
        <DeleteModal<Post>
          resource={post}
          submit={action.delete}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "update" && (
        <UpdateModal<Post>
          resource={post}
          submit={action.update}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default PostCard;
