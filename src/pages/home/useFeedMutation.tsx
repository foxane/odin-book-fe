import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as service from "../../services/post";
import useAuth from "../../hooks/useAuth";
import { DummyPost } from "../../components/post/DummyPost";
import { addPTag } from "../../lib/utils";

export default function useFeedMutation(queryKey: readonly unknown[]) {
  const { user } = useAuth();
  const client = useQueryClient();
  if (!user) throw new Error("useAuth is used outside of AuthProider!");

  const getPrevData = async () => {
    await client.cancelQueries({ queryKey });
    return client.getQueryData(queryKey);
  };

  const createPost = useMutation({
    mutationFn: service.createPost,
    onMutate: async (payload) => {
      const prev = await getPrevData();
      client.setQueryData(queryKey, (old: Post[] | undefined) =>
        old ? [new DummyPost(payload.text, user), ...old] : old,
      );
      return { prev };
    },
    onSettled: async () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const updatePost = useMutation({
    mutationFn: service.updatePost,
    onMutate: async (payload) => {
      const prev = await getPrevData();
      client.setQueryData(queryKey, (old: Post[] | undefined) => {
        if (!old) return old;
        return old.map((el) =>
          el.id === payload.id
            ? {
                ...el,
                text: addPTag(payload.text),
                status: "update",
                isPending: true,
              }
            : el,
        );
      });
      return { prev };
    },
    onSettled: async () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const deletePost = useMutation({
    mutationFn: service.deletePost,
    onMutate: async (toDelete) => {
      const prev = await getPrevData();
      client.setQueryData(queryKey, (old: Post[] | undefined) => {
        if (!old) return old;
        return old.map((el) =>
          el.id === toDelete.id
            ? { ...el, status: "delete", isPending: true }
            : el,
        );
      });
      return { prev };
    },
    onSettled: async () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const likePost = useMutation({
    mutationFn: service.likePost,
    onMutate: async (post) => {
      const prev = await getPrevData();
      const likeCount = post._count.likedBy + (post.isLiked ? -1 : 1);
      client.setQueryData(queryKey, (old: Post[] | undefined) => {
        if (!old) return old;
        return old.map((el) =>
          el.id === post.id
            ? /**
               * Inversing isLiked to make sure subsequent like mutation counted correctly
               */
              { ...el, isLiked: !el.isLiked, _count: { likedBy: likeCount } }
            : el,
        );
      });
      return { prev };
    },
    onSettled: async () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  return { createPost, updatePost, deletePost, likePost };
}
