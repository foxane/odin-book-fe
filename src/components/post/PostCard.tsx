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
import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/Dropdown";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../lib/utils";
import CommentFeed from "../comment/CommentFeed";
import { DeleteModal, UpdateModal } from "../ui/Modal";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
  action: PostAndCommentAction;
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
    <>
      <div
        className={twMerge(
          "card max-w-xl bg-base-100 px-4 py-2 shadow-md dark:border-0",
          className,
          post.isPending && "animate-pulse",
        )}
        {...props}
      >
        <div className="card-title">
          <div className="grid h-10 grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-3">
            <UserAvatar
              user={post.user}
              className="row-span-2 h-7 w-7 text-xs"
            />
            <p className="text-sm font-semibold">{post.user.name}</p>
            <p className="label text-xs font-normal">
              {formatDate(post.createdAt)}
            </p>
          </div>

          {post.isPending && (
            <p className="ms-auto text-sm">
              <span className="loading me-2 loading-xs" />
              {post.status === "create"
                ? "Creating"
                : post.status === "update"
                  ? "Updating"
                  : "Deleting"}
              ...
            </p>
          )}

          <Dropdown
            className={twMerge(
              "dropdown-open dropdown-end",
              !post.isPending && "ms-auto",
            )}
          >
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

        <div className="px-5 py-2">
          <div dangerouslySetInnerHTML={{ __html: post.text }} />
        </div>

        <div className="card-actions">
          <button
            className="btn tooltip flex justify-start btn-sm btn-ghost"
            data-tip="Like post"
            onClick={() => action.like(post)}
          >
            <HeartIcon
              size={18}
              className={twMerge(post.isLiked && "fill-primary stroke-primary")}
            />
            {post._count.likedBy}
          </button>

          <button
            onClick={() => setIsCommentOpen(!isCommentOpen)}
            className="btn tooltip flex justify-start btn-sm btn-ghost"
            data-tip="Show comment"
          >
            <MessageSquare size={18} />
            {post._count.comment}
          </button>
        </div>

        {/* Outside of domtree (modals, dropdown, etc) */}
        {modal === "update" && (
          <UpdateModal
            onClose={() => setModal(null)}
            res={post}
            submit={action.update}
          />
        )}

        {modal === "delete" && (
          <DeleteModal
            onClose={() => setModal(null)}
            res={post}
            submit={action.delete}
          />
        )}

        {isCommentOpen && <CommentFeed post={post} />}
      </div>
    </>
  );
};

export default PostCard;
