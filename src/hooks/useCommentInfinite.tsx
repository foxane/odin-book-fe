import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "../utils/services";
import DummyComment from "../components/commet/DummyComment";
import useAuth from "./useAuth";

interface CommentPage {
  pages: IComment[][];
  pageParams: never[];
}

//  TODO: Refetch only mutated page, do not invalidate entire query
// - find a way to get mutated page index, remember that each page is an array
//   probably need to iterate inside arr.findIndex(el => el.some(elm => elm.id === param))?

export default function useCommentInfinite(queryKey: readonly unknown[]) {
  const { user } = useAuth();
  const client = useQueryClient();

  const _getPrev = async () => {
    await client.cancelQueries({ queryKey });
    const data = client.getQueryData<CommentPage>(queryKey);
    if (!data) throw new Error("No cached comment data!");
    return data;
  };

  const createComment = useMutation({
    mutationFn: ({ c, p }: { c: CommentPayload; p: Post }) =>
      commentService.create(c, p),
    onMutate: async ({ c, p }) => {
      const prev = await _getPrev();

      client.setQueryData(queryKey, {
        ...prev,
        pages: [
          [new DummyComment(c.text, user!, p.id), ...prev.pages[0]],
          ...prev.pages.slice(1),
        ],
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const updateComment = useMutation({
    mutationFn: commentService.update,
    onMutate: async (updated) => {
      const prev = await _getPrev();
      const staged: IComment = {
        ...updated,
        isPending: true,
        status: "update",
      };

      client.setQueryData(queryKey, {
        ...prev,
        pages: prev.pages.map((page) =>
          page.map((comment) => (comment.id !== updated.id ? comment : staged)),
        ),
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const deleteComment = useMutation({
    mutationFn: commentService.delete,
    onMutate: async (deleted) => {
      const prev = await _getPrev();
      const staged: IComment = {
        ...deleted,
        isPending: true,
        status: "delete",
      };

      client.setQueryData(queryKey, {
        ...prev,
        pages: prev.pages.map((page) =>
          page.map((comment) => (comment.id !== deleted.id ? comment : staged)),
        ),
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const likeComment = useMutation({
    mutationFn: commentService.like,
    onMutate: async (comment) => {
      const prev = await _getPrev();

      const { isLiked, _count } = comment;
      const staged: IComment = {
        ...comment,
        isLiked: !isLiked,
        _count: {
          likedBy: isLiked ? _count.likedBy - 1 : +1,
        },
      };

      client.setQueryData(queryKey, {
        ...prev,
        pages: prev.pages.map((page) =>
          page.map((el) => (el.id !== comment.id ? el : staged)),
        ),
      });

      return { prev };
    },

    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  return {
    create: createComment.mutate,
    update: updateComment.mutate,
    delete: deleteComment.mutate,
    like: likeComment.mutate,
  };
}
