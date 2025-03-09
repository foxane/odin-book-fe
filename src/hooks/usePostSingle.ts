import { useMutation, useQueryClient } from "@tanstack/react-query";
import { services } from "./usePostInfinite";
import { cancelAndGetPrev, modifyLike } from "../utils/helpers";
import { QUERY_KEY } from "../utils/constants";

export default function usePostSingle(queryKey: unknown[]) {
  const client = useQueryClient();
  const likePost = useMutation({
    mutationFn: (post: Post) => services.like(post),
    onMutate: async () => {
      const prev = await cancelAndGetPrev(client, queryKey);
      client.setQueryData(queryKey, (old: Post) => modifyLike(old));
      return { prev };
    },
    onError: (_, __, context) => {
      return context?.prev ?? client.setQueryData(queryKey, context?.prev);
    },
  });

  const updatePost = useMutation({
    mutationFn: (post: Post) => services.update(post),
    onMutate: async (post: Post) => {
      const prev = await cancelAndGetPrev(client, queryKey);
      client.setQueryData(queryKey, { ...post, status: "update" });
      return { prev };
    },
    onError: (_, __, context) => {
      return context?.prev ?? client.setQueryData(queryKey, context?.prev);
    },
    onSettled: (_, __, post) => {
      client.setQueryData(queryKey, { ...post, status: undefined });
    },
  });

  const deletePost = useMutation({
    mutationFn: (post: Post) => services.delete(post),
    onMutate: async (post: Post) => {
      const prev = await cancelAndGetPrev(client, queryKey);
      client.setQueryData(queryKey, { ...post, status: "delete" });
      return { prev };
    },
    onError: (_, __, context) => {
      return context?.prev ?? client.setQueryData(queryKey, context?.prev);
    },
    onSettled: (_, __, post) => {
      client.setQueryData(queryKey, undefined);
      client.setQueryData(QUERY_KEY.posts, (old: InfinitePost) => ({
        ...old,
        pages: old.pages.map((page) => page.filter((el) => el.id !== post.id)),
      }));
    },
  });

  return { likePost, updatePost, deletePost };
}
