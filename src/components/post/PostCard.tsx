/**
 * Trying out on separating each section as a component.
 */

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
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface Props {
  post: Post;
}

interface Actions {
  delete: () => void;
  like: () => void;
  update: () => void;
}

export default function PostCard({ post, ...props }: Props & Actions) {
  return (
    <div
      className={twMerge(
        "border-base-content/20 w-full space-y-2 rounded border p-4 pb-1 shadow-xl",
        post.status && "animate-pulse",
      )}
    >
      <Title post={post} />
      <Content post={post} />
      <Count count={post._count} />
      <Actions post={post} like={props.like} />
    </div>
  );
}

function Count({ count }: { count: { likedBy: number; comment: number } }) {
  const show = count.comment > 0 || count.likedBy > 0;

  if (!show) return;
  return (
    <div className="flex items-center px-2 text-xs">
      {count.likedBy > 0 && (
        <p className="inline-flex items-center gap-1">
          <HeartIcon size={16} className="fill-primary stroke-primary" />
          {count.likedBy}
        </p>
      )}

      {count.comment > 0 && <p className="ms-auto">{count.comment} comments</p>}
    </div>
  );
}

function Title({ post }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <UserAvatar user={post.user} size="30" />

      <div className="space-y-1">
        <p className="text-sm font-semibold">{post.user.name}</p>
        <p className="text-xs opacity-80">{formatDate(post.createdAt)}</p>
      </div>

      {post.status ? (
        <p className="ms-auto text-sm">
          {POST_STATUS_TEXT[post.status]}
          <span className="loading loading-sm ms-1"></span>
        </p>
      ) : (
        <PostDropdown post={post} />
      )}
    </div>
  );
}

function PostDropdown({ post }: Props) {
  const handleEdit = () => {
    console.log("Editing post: ", post);
  };

  const handleDelete = () => {
    console.log("Deleting post: ", post);
  };

  return (
    <div className="dropdown dropdown-end ms-auto">
      <div className="btn btn-square btn-sm btn-ghost" tabIndex={0}>
        <EllipsisIcon />
      </div>

      <ul
        className="dropdown-content menu menu-sm bg-base-200 rounded-box z-1 border-base-content/10 w-40 space-y-1 border shadow-md"
        tabIndex={0}
      >
        <li>
          <button onClick={handleEdit}>
            <PenBoxIcon size={20} /> Edit
          </button>
        </li>
        <li>
          <button onClick={handleDelete}>
            <Trash2Icon size={20} /> Delete
          </button>
        </li>
      </ul>
    </div>
  );
}

function Content({ post }: Props) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: post.text }} className="py-2" />
      {post.media.map((src) => (
        <img src={src} key={src} loading="lazy" />
      ))}
    </div>
  );
}

function Actions({ post, like }: Props & { like: () => void }) {
  return (
    <div className="border-base-content/20 flex gap-2 border-t pt-2">
      <button className="btn btn-ghost grow text-xs" onClick={like}>
        <HeartIcon
          size={20}
          className={post.isLiked ? "stroke-primary fill-primary" : ""}
        />{" "}
        Like
      </button>

      <Link to={`/post/${post.id}`} className="btn btn-ghost grow text-xs">
        <MessageCircleIcon size={20} /> Comment
      </Link>

      <button className="btn btn-ghost grow text-xs">
        <Share2Icon size={20} /> Share
      </button>
    </div>
  );
}
