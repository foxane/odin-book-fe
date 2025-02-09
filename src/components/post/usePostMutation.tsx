import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as service from "../../services/post";
import useAuth from "../../hooks/useAuth";
import { DummyPost } from "../../components/post/DummyPost";
import { addPTag } from "../../lib/utils";

export const useFeedMutations = (queryKey: readonly unknown[]) => {
  const { user } = useAuth();
  const client = useQueryClient();
  if (!user) throw new Error("useAuth is used outside of AuthProider!");

  const getPrevData = async () => {
    await client.cancelQueries({ queryKey });
    return client.getQueryData<{ pages: Post[][]; pageParams: never[] }>(
      queryKey,
    );
  };

  const createPost = useMutation({
    mutationFn: service.createPost,
    onMutate: async (payload) => {
      const prev = await getPrevData();
      if (!prev) return;

      client.setQueryData(queryKey, {
        ...prev,
        pages: [
          // Add new post to the first page (prepend)
          [new DummyPost(payload.text, user), ...prev.pages[0]],
          ...prev.pages.slice(1),
        ],
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const updatePost = useMutation({
    mutationFn: service.updatePost,
    onMutate: async (payload) => {
      const prev = await getPrevData();
      if (!prev) return;

      client.setQueryData(queryKey, {
        ...prev,
        pages: prev.pages.map((page) =>
          page.map((el) =>
            el.id === payload.id
              ? {
                  ...el,
                  text: addPTag(payload.text),
                  status: "update",
                  isPending: true,
                }
              : el,
          ),
        ),
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const deletePost = useMutation({
    mutationFn: service.deletePost,
    onMutate: async (toDelete) => {
      const prev = await getPrevData();
      if (!prev) return;

      client.setQueryData(queryKey, {
        ...prev,
        pages: prev.pages.map((page) =>
          page.map((el) =>
            el.id === toDelete.id
              ? { ...el, status: "delete", isPending: true }
              : el,
          ),
        ),
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const likePost = useMutation({
    mutationFn: service.likePost,
    onMutate: async (post) => {
      const prev = await getPrevData();
      if (!prev) return;

      const likeCount = post._count.likedBy + (post.isLiked ? -1 : 1);

      client.setQueryData(queryKey, {
        ...prev,
        pages: prev.pages.map((page) =>
          page.map((el) =>
            el.id === post.id
              ? { ...el, isLiked: !el.isLiked, _count: { likedBy: likeCount } }
              : el,
          ),
        ),
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  return { createPost, updatePost, deletePost, likePost };
};
