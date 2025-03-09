import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../utils/services";
import { DEFAULT_API_CURSOR_LIMIT, QUERY_KEY } from "../utils/constants";
import { modifyLike } from "../utils/helpers";
import useOptimistic from "./useOptimistic";

type QueryKey = string[];

export function usePostQuery(queryKey: QueryKey) {
  const client = useQueryClient();
  return useQuery({
    queryKey,
    queryFn: async () =>
      (await api.axios.get<Post>(`/posts/${queryKey[1]}`)).data,
    initialDataUpdatedAt: client.getQueryState(QUERY_KEY.posts)?.dataUpdatedAt,
    initialData: client
      .getQueryData<InfinitePost>(QUERY_KEY.posts)
      ?.pages.flatMap((page) => page)
      .find((post) => post.id === Number(queryKey[1])),
  });
}

export function useCommentQuery(queryKey: QueryKey) {
  return useInfiniteQuery({
    queryKey: queryKey,
    initialPageParam: "",
    queryFn: async ({ pageParam }) =>
      (
        await api.axios.get<IComment[]>(
          `/posts/${queryKey[1]}/comments?cursor=${pageParam}`,
        )
      ).data,
    getNextPageParam: (page) =>
      page.length > DEFAULT_API_CURSOR_LIMIT
        ? page.at(-1)!.id.toString()
        : undefined,
  });
}

export function usePostMutation(queryKey: unknown[]) {
  const likePost = useOptimistic<Post, [Post]>({
    queryKey,
    mutateFn: (old) => modifyLike(old),
    apiCall: async (post) =>
      await api.axios[post.isLiked ? "delete" : "post"](
        `/posts/${post.id}/like`,
      ),
  });

  const updatePost = useOptimistic<Post, [Post]>({
    queryKey,
    mutateFn: (post, updated) => ({ ...post, text: updated.text }),
    apiCall: async (updated) =>
      await api.axios.put(`/posts/${updated.id}`, { text: updated.text }),
  });

  const deletePost = useOptimistic<Post, [Post]>({
    queryKey,
    mutateFn: (post) => post,
    apiCall: async (toDelete) =>
      await api.axios.delete(`/posts/${toDelete.id}`),
  });

  return { likePost, updatePost, deletePost };
}

export function useCommentMutation(queryKey: unknown[]) {
  const likeComment = useOptimistic<InfiniteComment, [IComment]>({
    queryKey,
    apiCall: async (comment: IComment) =>
      await api.axios[comment.isLiked ? "delete" : "post"](
        `/posts/${comment.postId}/like`,
      ),
    mutateFn: (old, comment: IComment) => ({
      ...old,
      pages: old.pages.map((page) =>
        page.map((el) => (el.id === comment.id ? modifyLike(el) : el)),
      ),
    }),
  });

  const deleteComment = useOptimistic<InfiniteComment, [IComment]>({
    queryKey,
    apiCall: async (comment) =>
      await api.axios.delete(`/post/${comment.postId}/comments/${comment.id}`),
    mutateFn: (old, comment) => ({
      ...old,
      pages: old.pages.map((page) => page.filter((el) => el.id !== comment.id)),
    }),
  });

  const updateComment = useOptimistic<InfiniteComment, [IComment]>({
    queryKey,
    apiCall: async (comment) =>
      await api.axios.put(`/post/${comment.postId}/comments/${comment.id}`, {
        text: comment.text,
      }),
    mutateFn: (old, comment) => ({
      ...old,
      pages: old.pages.map((page) =>
        page.map((el) => (el.id === comment.id ? comment : el)),
      ),
    }),
  });

  return { likeComment, deleteComment, updateComment };
}
