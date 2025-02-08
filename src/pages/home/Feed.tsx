import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "../../services/post";
import PostCard from "../../components/post/PostCard";
import { useFeedMutations } from "./useFeedMutation";
import PostForm from "../../components/post/PostForm";

function Feed() {
  const { likePost, deletePost, updatePost, createPost } = useFeedMutations([
    "posts",
  ]);
  const query = useInfiniteQuery({
    queryKey: ["posts"],
    initialPageParam: "",
    queryFn: ({ pageParam }) => getFeed(pageParam),
    getNextPageParam: (prevPage) => {
      if (prevPage.length < 10) return undefined;
      else return prevPage.at(-1)?.id.toString();
    },
  });

  const posts = query.data?.pages.flat() ?? [];

  return (
    <div>
      <section className="space-y-5 p-3">
        <PostForm submit={createPost.mutate} />

        {posts.map((el) => (
          <PostCard
            className="mx-auto"
            post={el}
            key={el.id}
            action={{
              update: updatePost.mutate,
              like: likePost.mutate,
              delete: deletePost.mutate,
            }}
          />
        ))}

        <button
          className="btn"
          onClick={() => {
            void query.fetchNextPage();
          }}
        >
          Load more
        </button>
      </section>
    </div>
  );
}

export default Feed;
