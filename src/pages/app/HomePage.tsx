import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../utils/services";
import {
  DEFAULT_API_CURSOR_LIMIT as LIMIT,
  QUERY_KEY,
} from "../../utils/constants";
import PostForm from "../../components/post/PostForm";
import PostList from "../../components/post/PostList";
import PostSkeleton from "../../components/post/PostSkeleton";
import InfiniteScrollObserver from "../../components/common/InfiniteScrollObserver";
import { BotIcon } from "lucide-react";

function HomePage() {
  const postQuery = useInfiniteQuery({
    queryKey: QUERY_KEY.posts,
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      return (await api.axios.get<Post[]>(`/posts?cursor=${pageParam}`)).data;
    },
    getNextPageParam: (page) => {
      if (page.length < LIMIT) return undefined;
      else return page.at(-1)!.id.toString();
    },
  });

  return (
    <div className="space-y-6">
      <PostForm />
      <PostList query={postQuery} queryKey={QUERY_KEY.posts} />

      {postQuery.isPending &&
        Array(10)
          .fill("")
          .map((_, i) => <PostSkeleton key={i} />)}

      <InfiniteScrollObserver
        query={postQuery}
        loadingComponent={
          <div>
            <BotIcon className="mx-auto animate-bounce" size={40} />
          </div>
        }
      />
    </div>
  );
}

export default HomePage;
