import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../utils/services";
import { addPTag } from "../utils/helper";

export const usePostSingle = (queryKey: readonly unknown[]) => {
  const client = useQueryClient();

  const _getPrev = async () => {
    await client.cancelQueries({ queryKey });
    return client.getQueryData<Post>(queryKey);
  };

  const updatePost = useMutation({
    mutationFn: postService.update,
    onMutate: async (post) => {
      const prev = await _getPrev();
      client.setQueryData(queryKey, (old: Post | undefined) =>
        old
          ? {
              ...old,
              text: addPTag(post.text),
              isPending: true,
              status: "update",
            }
          : old,
      );
      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const likePost = useMutation({
    mutationFn: postService.like,
    onMutate: async (post) => {
      const prev = await _getPrev();

      const { likedBy, comment } = post._count;
      const likeCount = likedBy + (post.isLiked ? -1 : 1);
      const updated: Partial<Post> = {
        isLiked: !post.isLiked,
        _count: { likedBy: likeCount, comment },
      };

      client.setQueryData(queryKey, (old: Post | undefined) =>
        old ? updated : old,
      );
      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const deletePost = useMutation({
    mutationFn: postService.delete,
    onMutate: async (deleted) => {
      const prev = await _getPrev();
      client.setQueryData(queryKey, (old: Post | undefined) =>
        old ? { ...deleted, isPending: true, status: "delete" } : old,
      );
      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  return {
    update: updatePost.mutate,
    like: likePost.mutate,
    delete: deletePost.mutate,
  };
};
