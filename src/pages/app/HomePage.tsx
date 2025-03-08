import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../utils/services";
import {
  DEFAULT_API_CURSOR_LIMIT as LIMIT,
  QUERY_KEY,
} from "../../utils/constants";
import PostCard from "../../components/post/PostCard";
import PostForm from "../../components/post/PostForm";
import { useDelete, useLike, useUpdate } from "../../hooks/usePostActions";

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
  const postList = postQuery.data?.pages.flat() ?? [];

  const like = useLike();
  const update = useUpdate();
  const deletePost = useDelete();

  return (
    <div className="space-y-6">
      <PostForm />

      <section className="space-y-4">
        {postList.map((el) => (
          <PostCard
            post={el}
            key={el.id}
            like={() => like(el)}
            update={() => update(el)}
            delete={() => deletePost(el)}
          />
        ))}
      </section>
    </div>
  );
}

export default HomePage;
