import { toast } from "react-toastify";
import { commentService } from "../utils/services";
import { useQueryClient } from "@tanstack/react-query";

export default function useCommentInfinite(queryKey: readonly unknown[]) {
  const client = useQueryClient();

  const createComment = async (payload: CommentPayload, post: Post) => {
    const newComment = await toast.promise(
      commentService.create(payload, post),
      {
        pending: "Posting comment...",
        error: "Comment posted",
        success: "Comment posted",
      },
    );
    client.setQueryData(queryKey, (old: InfiniteData<IComment[]>) => ({
      ...old,
      pages: [[newComment, ...old.pages[0]], ...old.pages.slice(1)],
    }));
  };

  const updateComment = async (comment: IComment) => {
    const updatedComment = await toast.promise(commentService.update(comment), {
      pending: "Updating comment...",
      error: "Update comment failed",
      success: "Comment updated",
    });
    client.setQueryData(queryKey, (old: InfiniteData<IComment[]>) => ({
      ...old,
      pages: old.pages.map((page) =>
        page.map((el) => (el.id === comment.id ? updatedComment : el)),
      ),
    }));
  };

  const likeComment = async (comment: IComment) => {
    const prevData = client.getQueryData(queryKey);
    client.setQueryData(queryKey, (old: InfiniteData<IComment[]>) => ({
      ...old,
      pages: old.pages.map((page) =>
        page.map((el) =>
          el.id === comment.id
            ? {
                ...el,
                isLiked: !comment.isLiked,
                _count: {
                  likedBy: el._count.likedBy + (comment.isLiked ? -1 : +1),
                },
              }
            : el,
        ),
      ),
    }));
    try {
      await commentService.like(comment);
    } catch (error) {
      console.log(error);
      toast.error("Error liking post");
      client.setQueryData(queryKey, prevData);
    }
  };

  const deleteComment = async (comment: IComment) => {
    await toast.promise(commentService.delete(comment), {
      pending: "Deleting comment...",
      error: "Delete comment failed",
      success: "Comment deleted",
    });

    client.setQueryData(queryKey, (old: InfiniteData<IComment[]>) => ({
      ...old,
      pages: old.pages.map((page) => page.filter((el) => el.id !== comment.id)),
    }));
  };

  return {
    likeComment,
    updateComment,
    deleteComment,
    createComment,
  };
}
