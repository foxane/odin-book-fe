import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, likePost, updatePost } from "../services/post";

import useAuth from "./useAuth";
import { addPTag } from "../lib/utils";

export default function useFeedMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getPrevPost = async () => {
    await queryClient.cancelQueries({ queryKey: ["posts"] });
    return queryClient.getQueryData(["posts"]);
  };

  const create = useMutation({
    mutationFn: (p: PostPayload) => createPost(p),

    onMutate: async (post) => {
      const prev = await getPrevPost();

      // TODO: Create new class to mimic post as much as possible
      const newPost = {
        ...post,
        user,
        id: Date.now(),
        text: addPTag(post.text),
        isPending: true,
      };

      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (oldPosts) return [newPost, ...oldPosts];
        else return [newPost];
      });

      return { prev };
    },

    onSettled: async (_, __, ___, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["posts"], ctx.prev);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const update = useMutation({
    mutationFn: (p: Post) => updatePost(p),

    onMutate: async (updated) => {
      const prev = await getPrevPost();

      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((post) =>
          post.id === updated.id
            ? { ...updated, text: addPTag(updated.text), isPending: true }
            : post,
        );
      });

      return { prev };
    },

    onSettled: async (_, __, ___, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["posts"], ctx.prev);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const like = useMutation({
    mutationFn: (p: Post) => likePost(p.id, !p.isLiked),

    onMutate: async (post) => {
      const prev = await getPrevPost();

      const likeCount = post._count.likedBy + (post.isLiked ? -1 : 1);

      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((el) =>
          el.id === post.id
            ? { ...el, isLiked: !el.isLiked, _count: { likedBy: likeCount } }
            : el,
        );
      });

      return { prev };
    },

    onSettled: async (_, __, ___, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["posts"], ctx.prev);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const yeet = useMutation({
    mutationFn: (p: Post) => deletePost(p.id),

    onMutate: async (toDelete) => {
      const prev = await getPrevPost();

      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.filter((el) => el.id !== toDelete.id);
      });

      return { prev };
    },

    onSettled: async (_, __, ___, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["posts"], ctx.prev);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { create, update, like, yeet };
}
