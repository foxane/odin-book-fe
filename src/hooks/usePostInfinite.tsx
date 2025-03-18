import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/services";
import { cancelAndGetPrev, modifyLike } from "../utils/helpers";
import { toast } from "react-toastify";

export const services = {
  like: async (post: Post) =>
    await api.axios[post.isLiked ? "delete" : "post"](`/posts/${post.id}/like`),

  update: async (updated: Post) =>
    await api.axios.put(`/posts/${updated.id}`, { text: updated.text }),

  delete: async (deleted: Post) =>
    await api.axios.delete(`/posts/${deleted.id}`),
};

const updater = {
  like: (old: InfinitePost, post: Post) => ({
    ...old,
    pages: old.pages.map((page) =>
      page.map((el) => (el.id === post.id ? modifyLike(el) : el)),
    ),
  }),

  update: (old: InfinitePost, post: Post) => ({
    ...old,
    pages: old.pages.map((page) =>
      page.map((el) =>
        el.id === post.id ? { ...post, status: "update" } : el,
      ),
    ),
  }),

  delete: (old: InfinitePost, post: Post) => ({
    ...old,
    pages: old.pages.map((page) =>
      page.map((el) =>
        el.id === post.id ? { ...post, status: "delete" } : el,
      ),
    ),
  }),

  updateCleanup: (old: InfinitePost, post: Post) => ({
    ...old,
    pages: old.pages.map((page) =>
      page.map((el) =>
        el.id === post.id ? { ...post, status: undefined } : el,
      ),
    ),
  }),

  deleteCleanup: (old: InfinitePost, post: Post) => ({
    ...old,
    pages: old.pages.map((page) => page.filter((el) => el.id !== post.id)),
  }),
};

const handlerError = (error: Error) => {
  console.log(error);
  toast.error(error.message);
};

const usePostInfinite = (queryKey: unknown[]) => {
  const client = useQueryClient();
  const revert = (old: InfinitePost) => client.setQueryData(queryKey, old);

  /*
   * ================= Like ==================
   */
  const likePost = useMutation({
    mutationFn: (post: Post) => services.like(post),
    onMutate: async (post) => {
      const prev = await cancelAndGetPrev<InfinitePost>(client, queryKey);
      client.setQueryData(queryKey, (old: InfinitePost | undefined) =>
        old ? updater.like(old, post) : old,
      );
      return { prev };
    },

    onError: (error, _post, context) => {
      handlerError(error);
      return context?.prev && revert(context.prev);
    },
  });

  /*
   * ================= Update ==================
   */
  const updatePost = useMutation({
    mutationFn: (post: Post) => services.update(post),
    onMutate: async (post) => {
      const prev = await cancelAndGetPrev<InfinitePost>(client, queryKey);
      client.setQueryData(queryKey, (old: InfinitePost | undefined) =>
        old ? updater.update(old, post) : old,
      );
      return { prev };
    },

    onError: (error, _post, context) => {
      handlerError(error);
      return context?.prev && revert(context.prev);
    },

    onSettled: (_, __, post) => {
      client.setQueryData(queryKey, (old: InfinitePost | undefined) =>
        old ? updater.updateCleanup(old, post) : old,
      );
    },
  });

  /*
   * ================= Delete ==================
   */
  const deletePost = useMutation({
    mutationFn: (post: Post) => services.delete(post),
    onMutate: async (post) => {
      const prev = await cancelAndGetPrev<InfinitePost>(client, queryKey);
      client.setQueryData(queryKey, (old: InfinitePost | undefined) =>
        old ? updater.delete(old, post) : old,
      );
      return { prev };
    },

    onError: (error, _post, context) => {
      handlerError(error);
      return context?.prev && revert(context.prev);
    },

    onSettled: (_, __, post) => {
      client.setQueryData(queryKey, (old: InfinitePost | undefined) =>
        old ? updater.deleteCleanup(old, post) : old,
      );
    },
  });

  return { likePost, updatePost, deletePost };
};

export default usePostInfinite;
