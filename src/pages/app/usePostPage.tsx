import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../../utils/services";
import { DEFAULT_API_CURSOR_LIMIT, QUERY_KEY } from "../../utils/constants";

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
    getNextPageParam: (page) => {
      if (page.length < DEFAULT_API_CURSOR_LIMIT) return undefined;
      else return page.at(-1)?.id.toString();
    },
  });
}
