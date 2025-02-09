import { twMerge } from "tailwind-merge";
import UserAvatar from "../ui/UserAvatar";
import {
  EllipsisVerticalIcon,
  FlagIcon,
  HeartIcon,
  MessageSquare,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { DeletePostModal, UpdatePostModal } from "./PostModal";
import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/Dropdown";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../lib/utils";
import CommentFeed from "../comment/CommentFeed";

interface PostAction {
  like: (post: Post) => void;
  update: (post: Post) => void;
  delete: (post: Post) => void;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
  action: PostAction;
}

type ModalType = "delete" | "update" | null;

const PostCard = ({ post, action, className, ...props }: Props) => {
  const { user } = useAuth();
  const [modal, setModal] = useState<ModalType>(null);
  const [dropdown, setDropdown] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const openModal = (a: ModalType) => {
    setDropdown(false);
    setModal(a);
  };

  return (
    <div
      className={twMerge(
        "max-w-xl rounded bg-base-100 p-2 shadow-md",
        className,
        post.isPending && "animate-pulse",
      )}
      {...props}
    >
      <div className="card-title">
        <UserAvatar user={post.user} className="h-8 w-8 text-sm" />
        <p className="text-base font-semibold">{post.user.name}</p>
        <p className="space-x-1 text-xs font-normal">
          <span>{formatDate(post.createdAt)}</span>
        </p>

        <Dropdown className="dropdown-open dropdown-end ms-auto">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setDropdown(!dropdown)}
          >
            <DropdownTrigger>
              <EllipsisVerticalIcon />
            </DropdownTrigger>
          </button>

          {dropdown && (
            <>
              <DropdownContent className="w-32 gap-1 border border-base-300 bg-base-100 py-4">
                <button
                  disabled={!!user && user.id !== post.user.id}
                  className="btn flex btn-block justify-start btn-sm btn-ghost"
                  onClick={() => openModal("update")}
                >
                  <PencilIcon size={18} /> Edit
                </button>
                <button className="btn flex btn-block justify-start btn-sm btn-ghost">
                  <FlagIcon size={18} /> Report
                </button>
                <button
                  disabled={!!user && user.id !== post.user.id}
                  className="btn flex btn-block justify-start btn-sm btn-ghost"
                  onClick={() => openModal("delete")}
                >
                  <Trash2Icon size={18} /> Delete
                </button>
              </DropdownContent>
              <div
                className="fixed top-0 left-0 z-50 h-screen w-full bg-base-300 opacity-20"
                onClick={() => setDropdown(false)}
              />
            </>
          )}
        </Dropdown>
      </div>

      <div className="card-body">
        <div dangerouslySetInnerHTML={{ __html: post.text }} />
      </div>

      <div className="card-actions">
        <button
          className="btn tooltip flex justify-start btn-ghost"
          data-tip="Like post"
          onClick={() => action.like(post)}
        >
          <HeartIcon
            className={twMerge(post.isLiked && "fill-primary stroke-primary")}
          />
          {post._count.likedBy}
        </button>

        <button
          onClick={() => setIsCommentOpen(!isCommentOpen)}
          className="btn tooltip flex justify-start btn-ghost"
          data-tip="Show comment"
        >
          <MessageSquare />
          {post._count.comment}
        </button>
      </div>

      {isCommentOpen && <CommentFeed post={post} />}

      {/* Outside of domtree (modals, dropdown, etc) */}
      {modal === "update" && (
        <UpdatePostModal
          onClose={() => setModal(null)}
          post={post}
          submit={action.update}
        />
      )}

      {modal === "delete" && (
        <DeletePostModal
          onClose={() => setModal(null)}
          post={post}
          submit={action.delete}
        />
      )}
    </div>
  );
};

export default PostCard;
