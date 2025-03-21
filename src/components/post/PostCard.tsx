import {
  EllipsisIcon,
  HeartIcon,
  MessageCircleIcon,
  PenBoxIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import UserAvatar from "../user/UserAvatar";
import { formatDate } from "../../utils/helpers";
import { POST_STATUS_TEXT } from "../../utils/constants";
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import Img from "../common/Img";
import useAuth from "../../context/AuthContext";

interface Props {
  post: Post;
  delete: () => void;
  like: () => void;
  update: () => void;
}

export default function PostCard({ post, ...actions }: Props) {
  const currentUser = useAuth((s) => s.user)!;
  const location = useLocation();

  /**
   * Disabling post mutation like delete, edit, etc.
   *
   * Will be extended when granular authrization needed
   */
  const disableAction =
    currentUser.id !== post.userId || currentUser.role === "GUEST";

  return (
    <div
      className={twMerge(
        "border-base-content/20 w-full space-y-2 rounded border p-4 pb-1 shadow-xl",
        post.status && "animate-pulse",
      )}
    >
      {/* Title Section */}
      <div className="flex items-center space-x-2">
        <Link to={`/user/${post.user.id}`} className="p-0">
          <UserAvatar user={post.user} />
        </Link>
        <Link to={`/user/${post.user.id}`}>
          <p className="text-sm font-semibold">{post.user.name}</p>
          <p className="text-xs opacity-80">{formatDate(post.createdAt)}</p>
        </Link>

        {/* Dropdown section */}
        {post.status ? (
          <p className="ms-auto text-sm">
            {POST_STATUS_TEXT[post.status]}
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
              <li className={twMerge(disableAction && "menu-disabled")}>
                <button disabled={disableAction} onClick={actions.update}>
                  <PenBoxIcon size={20} /> Edit
                </button>
              </li>
              <li className={twMerge(disableAction && "menu-disabled")}>
                <button disabled={disableAction} onClick={actions.delete}>
                  <Trash2Icon size={20} /> Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div>
        <div
          dangerouslySetInnerHTML={{ __html: post.text }}
          className="break-all py-2"
        />
        {post.media[0] && (
          <Img src={post.media[0]} className="w-full rounded" />
        )}
      </div>

      {/* Count Section */}
      {(post._count.likedBy > 0 || post._count.comment > 0) && (
        <div className="flex items-center px-2 text-xs">
          {post._count.likedBy > 0 && (
            <p className="inline-flex items-center gap-1">
              <HeartIcon size={16} className="fill-primary stroke-primary" />
              {post._count.likedBy}
            </p>
          )}
          {post._count.comment > 0 && (
            <p className="ms-auto">{post._count.comment} comments</p>
          )}
        </div>
      )}

      {/* Actions Section */}
      <div className="border-base-content/20 flex gap-2 border-t pt-2">
        <button className="btn btn-ghost grow text-xs" onClick={actions.like}>
          <HeartIcon
            size={20}
            className={post.isLiked ? "stroke-primary fill-primary" : ""}
          />{" "}
          Like
        </button>
        {!location.pathname.includes("/post") && (
          <Link to={`/post/${post.id}`} className="btn btn-ghost grow text-xs">
            <MessageCircleIcon size={20} /> Comment
          </Link>
        )}
        <button className="btn btn-ghost grow text-xs">
          <Share2Icon size={20} /> Share
        </button>
      </div>
    </div>
  );
}
