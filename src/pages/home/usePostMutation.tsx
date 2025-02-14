import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { DummyPost } from "../../components/post/DummyPost";
import { addPTag } from "../../utils/helper";
import { postService } from "../../utils/services";

export const usePostMutations = (queryKey: readonly unknown[]) => {
  const { user } = useAuth();
  const client = useQueryClient();
  if (!user) throw new Error("useAuth is used outside of AuthProider!");

  const getPrevData = async () => {
    await client.cancelQueries({ queryKey });
    return client.getQueryData<{ pages: Post[][]; pageParams: never[] }>(
      queryKey,
    );
  };

  const createMutation = useMutation({
    mutationFn: postService.create,
    onMutate: async (payload) => {
      const prev = await getPrevData();
      if (!prev) return;

      client.setQueryData(queryKey, {
        ...prev,
        pages: [
          // Add new post to the first page (prepend)
          [new DummyPost(payload.get("text") ?? "", user), ...prev.pages[0]],
          ...prev.pages.slice(1),
        ],
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const updateMutation = useMutation({
    mutationFn: postService.update,
    onMutate: async (payload) => {
      const prev = await getPrevData();
      if (!prev) return;

      const updated = {
        text: addPTag(payload.text),
        status: "update",
        isPending: true,
      };

      client.setQueryData(queryKey, {
        ...prev,
        pages: prev.pages.map((page) =>
          page.map((el) => (el.id === payload.id ? { ...el, ...updated } : el)),
        ),
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  const deleteNutation = useMutation({
    mutationFn: postService.delete,
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

  const likeMutation = useMutation({
    mutationFn: postService.like,
    onMutate: async (post) => {
      const prev = await getPrevData();
      if (!prev) return;

      const { likedBy, comment } = post._count;
      const likeCount = likedBy + (post.isLiked ? -1 : 1);
      const updated: Partial<Post> = {
        isLiked: !post.isLiked,
        _count: { likedBy: likeCount, comment },
      };

      client.setQueryData(queryKey, {
        ...prev,
        pages: prev.pages.map((page) =>
          page.map((el) => (el.id === post.id ? { ...el, ...updated } : el)),
        ),
      });

      return { prev };
    },
    onSettled: () => client.invalidateQueries({ queryKey }),
    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteNutation.mutate,
    like: likeMutation.mutate,
  };
};
