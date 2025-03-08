import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../utils/constants";
import { api } from "../utils/services";

const queryKey = QUERY_KEY.posts;

/**
 * Function to modidy cache
 * @param data InifitePost
 * @param args Array of argmuments to call the updater with
 */
type Updater<T extends unknown[]> = (
  data: InfinitePost,
  ...args: T
) => InfinitePost;

/**
 * Gennerate optimistic update for InfinitePost data
 */
interface CreateOptimistic<T extends unknown[]> {
  updater: Updater<T>;

  /**
   * Api call to make
   * @param args Array of arguments needed
   */
  apiCall: (...args: T) => Promise<void>;
}

function useCreateOptimistic<T extends unknown[]>({
  updater,
  apiCall,
}: CreateOptimistic<T>) {
  const client = useQueryClient();

  return async (...args: T) => {
    await client.cancelQueries({ queryKey });
    const prevData = client.getQueryData<InfinitePost>(queryKey);

    client.setQueryData<InfinitePost>(queryKey, (data) =>
      data ? updater(data, ...args) : data,
    );

    try {
      await apiCall(...args);
    } catch (error) {
      /**
       * TODO: Add error handler, probably toast
       *
       */
      console.error(error);
      client.setQueryData(queryKey, prevData);
    }
  };
}

const likeUpdater: Updater<[Post]> = (data, post) => {
  const { _count, isLiked } = post;
  const updatedCount = {
    ..._count,
    likedBy: _count.likedBy + (isLiked ? -1 : +1),
  };

  return {
    ...data,
    pages: data.pages.map((page) =>
      page.map((el) =>
        el.id === post.id
          ? { ...el, isLiked: !isLiked, _count: updatedCount }
          : el,
      ),
    ),
  };
};
export const useLike = () => {
  return useCreateOptimistic<[Post]>({
    updater: likeUpdater,
    apiCall: async (post) => {
      if (post.isLiked) await api.axios.delete(`/posts/${post.id}/like`);
      else await api.axios.post(`/posts/${post.id}/like`);
    },
  });
};

const updateUpdater: Updater<[Post]> = (data, updatedPost) => ({
  ...data,
  pages: data.pages.map((page) =>
    page.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
  ),
});
export const useUpdate = () => {
  return useCreateOptimistic<[Post]>({
    updater: updateUpdater,
    apiCall: async (updatedPost) => {
      await api.axios.put(`/posts/${updatedPost.id}`, {
        text: updatedPost.text,
      });
    },
  });
};

const deleteUpdater: Updater<[Post]> = (data, toDelete) => ({
  ...data,
  pages: data.pages.map((page) =>
    page.filter((post) => post.id !== toDelete.id),
  ),
});
export const useDelete = () =>
  useCreateOptimistic<[Post]>({
    updater: deleteUpdater,
    apiCall: async (post) => await api.axios.delete(`/posts/${post.id}`),
  });
