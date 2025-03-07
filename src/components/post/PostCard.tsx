import {
  EllipsisIcon,
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
} from "lucide-react";
import UserAvatar from "../user/UserAvatar";
import { formatDate } from "../../utils/helpers";
import { Link } from "react-router-dom";

function PostCard({ post }: { post: Post }) {
  const { user } = post;
  const showCount = post._count.comment > 0 || post._count.likedBy > 0;

  return (
    <div className="border-base-content/10 w-full space-y-2 rounded border p-4 shadow-lg">
      <div className="flex items-center space-x-2">
        <UserAvatar user={user} size="30" />
        <div className="space-y-1">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs opacity-80">{formatDate(post.createdAt)}</p>
        </div>
        <div className="ms-auto">
          <button className="btn btn-square btn-sm">
            <EllipsisIcon />
          </button>
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: post.text }} className="py-2" />

      {showCount && (
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

      <div className="border-base-content/20 flex gap-2 border-t pt-2">
        <button className="btn btn-ghost grow text-xs">
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
    </div>
  );
}

export default PostCard;
