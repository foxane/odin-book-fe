import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/services";
import { cancelAndGetPrev, modifyLike } from "../utils/helpers";

const services = {
  like: async (c: IComment) =>
    await api.axios[c.isLiked ? "delete" : "post"](
      `/posts/${c.postId}/comments/${c.id}/like`,
    ),
  update: async (c: IComment) =>
    api.axios.put(`/posts/${c.postId}/comments/${c.id}`, { text: c.text }),
  delete: async (c: IComment) =>
    api.axios.delete(`/posts/${c.postId}/comments/${c.id}`),
};

const updater = {
  like: (old: InfiniteComment, comment: IComment) => ({
    ...old,
    pages: old.pages.map((page) =>
      page.map((el) => (el.id === comment.id ? modifyLike(el) : el)),
    ),
  }),
  update: (old: InfiniteComment, comment: IComment) => ({
    ...old,
    pages: old.pages.map((page) =>
      page.map((el) =>
        el.id === comment.id ? { ...comment, status: "update" } : el,
      ),
    ),
  }),
  updateCleanup: (old: InfiniteComment, comment: IComment) => ({
    ...old,
    pages: old.pages.map((page) =>
      page.map((el) =>
        el.id === comment.id ? { ...comment, status: undefined } : el,
      ),
    ),
  }),
  delete: (old: InfiniteComment, comment: IComment) => ({
    ...old,
    pages: old.pages.map((page) =>
      page.map((el) =>
        el.id === comment.id ? { ...el, status: "delete" } : el,
      ),
    ),
  }),
  deleteCleanup: (old: InfiniteComment, comment: IComment) => ({
    ...old,
    pages: old.pages.map((page) => page.filter((el) => el.id !== comment.id)),
  }),
};

const handlerError = () => {
  /*
   * TODO
   */
  alert("Error handler for optimistic update is not set!!!");
};

export default function useCommentInfinite(queryKey: unknown[]) {
  const client = useQueryClient();
  const revert = (old: InfiniteComment) => client.setQueryData(queryKey, old);

  /*
   * =================== Like ====================
   */
  const likeComment = useMutation({
    mutationFn: (comment: IComment) => services.like(comment),
    onMutate: async (comment) => {
      const prevData = await cancelAndGetPrev<InfiniteComment>(
        client,
        queryKey,
      );
      client.setQueryData(queryKey, (old: InfiniteComment | undefined) =>
        old ? updater.like(old, comment) : old,
      );
      return { prevData };
    },
    onError: (_, __, context) => {
      handlerError();
      return context?.prevData && revert(context.prevData);
    },
  });

  /*
   * =================== Update ====================
   */
  const updateComment = useMutation({
    mutationFn: (comment: IComment) => services.update(comment),
    onMutate: async (comment) => {
      const prevData = await cancelAndGetPrev<InfiniteComment>(
        client,
        queryKey,
      );
      client.setQueryData(queryKey, (old: InfiniteComment | undefined) =>
        old ? updater.update(old, comment) : old,
      );
      return { prevData };
    },
    onError: (_, __, context) => {
      handlerError();
      return context?.prevData && revert(context.prevData);
    },
    onSettled: (_, __, comment) => {
      client.setQueryData(queryKey, (old: InfiniteComment | undefined) =>
        old ? updater.updateCleanup(old, comment) : old,
      );
    },
  });

  /*
   * =================== Delete ====================
   */
  const deleteComment = useMutation({
    mutationFn: (comment: IComment) => services.delete(comment),
    onMutate: async (comment) => {
      const prevData = await cancelAndGetPrev<InfiniteComment>(
        client,
        queryKey,
      );
      client.setQueryData(queryKey, (old: InfiniteComment | undefined) =>
        old ? updater.delete(old, comment) : old,
      );
      return { prevData };
    },
    onError: (_, __, context) => {
      handlerError();
      return context?.prevData && revert(context.prevData);
    },
    onSettled: (_, __, comment) => {
      client.setQueryData(queryKey, (old: InfiniteComment | undefined) =>
        old ? updater.deleteCleanup(old, comment) : old,
      );
    },
  });

  return { likeComment, updateComment, deleteComment };
}
