import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { postService } from "../utils/services";
import { addPTag } from "../utils/helper";
import { DummyPost } from "../components/post/DummyPost";

interface PostPages {
  pages: Post[][];
  pageParams: never[];
}

//  TODO: Refetch only mutated page, do not invalidate entire query
// - find a way to get mutated page index, remember that each page is an array
//   probably need to iterate inside arr.findIndex(el => el.some(elm => elm.id === param))?

export const usePostInfinite = (queryKey: readonly unknown[]) => {
  const { user } = useAuth() as { user: User };
  const client = useQueryClient();

  /**
   * Invalidate and return cached data
   */
  const getPrevData = async () => {
    await client.cancelQueries({ queryKey });
    const data = client.getQueryData<PostPages>(queryKey);

    /**
     * In case user do mutation when no cache is found
     */
    if (!data) throw new Error("No cached data found");
    return data;
  };

  const createMutation = useMutation({
    mutationFn: postService.create,
    onMutate: async (payload) => {
      const prev = await getPrevData();
      const text = addPTag(payload.get("text") as string);

      client.setQueryData(queryKey, {
        ...prev,
        pages: [
          [new DummyPost(text, user), ...prev.pages[0]],
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
