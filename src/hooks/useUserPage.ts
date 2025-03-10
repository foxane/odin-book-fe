import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../utils/services";
import { DEFAULT_API_CURSOR_LIMIT, UserPageKeys } from "../utils/constants";
import { cancelAndGetPrev } from "../utils/helpers";

function useUserPage(userId: string, keys: UserPageKeys) {
  const client = useQueryClient();
  const { followerKey, followingKey, postKey, userKey } = keys;

  const userQuery = useQuery({
    queryKey: userKey,
    queryFn: () =>
      api.axios.get<User>(`/user/${userId}`).then((data) => data.data),
  });

  const postQuery = useInfiniteQuery({
    initialPageParam: "",
    queryKey: postKey,
    queryFn: ({ pageParam }) =>
      api.axios
        .get<Post[]>(`/user/${userId}/posts?cursor=${pageParam}`)
        .then((data) => data.data),

    getNextPageParam: (page) =>
      page.length > DEFAULT_API_CURSOR_LIMIT
        ? page.at(-1)?.id.toString()
        : undefined,
  });

  const followerQuery = useInfiniteQuery({
    initialPageParam: "",
    queryKey: followerKey,
    queryFn: ({ pageParam }) =>
      api.axios
        .get<User[]>(`/user/${userId}/follower?cursor=${pageParam}`)
        .then((data) => data.data),

    getNextPageParam: (page) =>
      page.length > DEFAULT_API_CURSOR_LIMIT
        ? page.at(-1)?.id.toString()
        : undefined,
  });

  const followingQuery = useInfiniteQuery({
    initialPageParam: "",
    queryKey: followingKey,
    queryFn: ({ pageParam }) =>
      api.axios
        .get<User[]>(`/user/${userId}/following?cursor=${pageParam}`)
        .then((data) => data.data),

    getNextPageParam: (page) =>
      page.length > DEFAULT_API_CURSOR_LIMIT
        ? page.at(-1)?.id.toString()
        : undefined,
  });

  const followUser = useMutation({
    mutationFn: (user: User) =>
      api.axios[user.isFollowed ? "delete" : "post"](
        `/users/${user.id}/follow`,
      ),

    onMutate: async () => {
      const prev = await cancelAndGetPrev(client, userKey);
      client.setQueryData(userKey, (old: User) => ({
        ...old,
        isFollowed: !old.isFollowed,
        _count: {
          ...old._count,
          follower: old._count.follower + (old.isFollowed ? -1 : +1),
        },
      }));
      return { prev };
    },

    onError: (_, __, context) =>
      context?.prev && client.setQueryData(userKey, context.prev),
  });

  return { userQuery, postQuery, followerQuery, followingQuery, followUser };
}

export default useUserPage;
