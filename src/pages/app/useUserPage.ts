import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../../utils/services";
import { DEFAULT_API_CURSOR_LIMIT, UserPageKeys } from "../../utils/constants";
import { cancelAndGetPrev, modifyFollow } from "../../utils/helpers";

export function usePostQuery(keys: UserPageKeys) {
  return useInfiniteQuery({
    initialPageParam: "",
    queryKey: keys.postKey,
    queryFn: ({ pageParam }) =>
      api.axios
        .get<
          Post[]
        >(`/user/${keys.postKey[1].userId}/posts?cursor=${pageParam}`)
        .then((data) => data.data),

    getNextPageParam: (page) => {
      if (page.length < DEFAULT_API_CURSOR_LIMIT) return undefined;
      return page.at(-1)?.id.toString();
    },
  });
}

export function useFollowerQuery(keys: UserPageKeys) {
  return useInfiniteQuery({
    initialPageParam: "",
    queryKey: keys.followerKey,
    queryFn: ({ pageParam }) =>
      api.axios
        .get<
          User[]
        >(`/user/${keys.followerKey[1].userId}/follower?cursor=${pageParam}`)
        .then((data) => data.data),

    getNextPageParam: (page) => {
      if (page.length < DEFAULT_API_CURSOR_LIMIT) return undefined;
      return page.at(-1)?.id.toString();
    },
  });
}

export function useFollowingQuery(keys: UserPageKeys) {
  return useInfiniteQuery({
    initialPageParam: "",
    queryKey: keys.followingKey,
    queryFn: ({ pageParam }) =>
      api.axios
        .get<
          User[]
        >(`/user/${keys.followingKey[1].userId}/following?cursor=${pageParam}`)
        .then((data) => data.data),

    getNextPageParam: (page) => {
      if (page.length < DEFAULT_API_CURSOR_LIMIT) return undefined;
      return page.at(-1)?.id.toString();
    },
  });
}

export function useFollowMutation(keys: UserPageKeys) {
  const client = useQueryClient();
  const { userKey } = keys;

  return useMutation({
    mutationFn: (user: User) =>
      api.axios[user.isFollowed ? "delete" : "post"](
        `/users/${user.id}/follow`,
      ),

    onMutate: async () => {
      const prev = await cancelAndGetPrev(client, userKey);
      client.setQueryData(userKey, (old: User) => modifyFollow(old));
      return { prev };
    },

    onError: (_, __, context) =>
      context?.prev && client.setQueryData(userKey, context.prev),
  });
}
