import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../utils/services";
import { DEFAULT_API_CURSOR_LIMIT as LIMIT } from "../../utils/helpers";
import PostCard from "../../components/post/PostCard";

function HomePage() {
  const postQuery = useInfiniteQuery({
    queryKey: ["posts"],
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

  return (
    <div>
      <form></form>

      <section className="space-y-5">
        {postList.map((el) => (
          <PostCard post={el} key={el.id} />
        ))}
      </section>
    </div>
  );
}

export default HomePage;
