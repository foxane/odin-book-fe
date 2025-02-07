import { twMerge } from "tailwind-merge";
import UserAvatar from "../ui/UserAvatar";
import { HeartIcon, MessageSquare } from "lucide-react";
import { useState } from "react";
import { DeletePostModal, UpdatePostModal } from "./PostModal";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
  action: {
    like: (post: Post) => void;
    update: (post: Post) => void;
    delete: (post: Post) => void;
  };
}

const PostCard = ({ post, action, ...props }: Props) => {
  const [modal, setModal] = useState<"delete" | "update" | null>(null);

  /**
   * Wait to show fadeout
   */
  const closeModal = () => {
    setTimeout(() => {
      setModal(null);
    }, 300);
  };

  return (
    <div
      className={twMerge(
        "p-2",
        post.isPending && "animate-pulse",
        props.className,
      )}
      {...props}
    >
      <div className="card-title">
        <UserAvatar user={post.user} />
        <p>{post.user.name}</p>
      </div>

      <div className="card-body">
        <div dangerouslySetInnerHTML={{ __html: post.text }} />
      </div>

      <div className="card-actions">
        <button
          className="btn tooltip flex btn-ghost"
          data-tip="Like post"
          onClick={() => action.like(post)}
        >
          <HeartIcon
            className={twMerge(post.isLiked && "fill-primary stroke-primary")}
          />
          {post._count.likedBy}
        </button>

        <button className="btn tooltip btn-ghost" data-tip="Show comment">
          <MessageSquare />
        </button>

        <button className="btn" onClick={() => setModal("update")}>
          Update
        </button>

        <button className="btn" onClick={() => setModal("delete")}>
          Delete
        </button>
      </div>

      {/* Outside of domtree (modals, dropdown, etc) */}
      {modal === "update" && (
        <UpdatePostModal
          onClose={closeModal}
          post={post}
          submit={action.update}
        />
      )}

      {modal === "delete" && (
        <DeletePostModal
          onClose={closeModal}
          post={post}
          submit={action.delete}
        />
      )}
    </div>
  );
};

export default PostCard;
