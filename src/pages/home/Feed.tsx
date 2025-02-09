import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "../../services/post";
import PostCard from "../../components/post/PostCard";
import { useFeedMutations } from "./useFeedMutation";
import PostForm from "../../components/post/PostForm";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "../../hooks/useIntersection";

function Feed() {
  const { likePost, deletePost, updatePost, createPost } = useFeedMutations([
    "posts",
  ]);
  /**
   * TODO: Optimize the query
   * Infinite query doesn't play nice with optimistic update, i wonder what to do...
   */
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

  /**
   * Autofetching logic
   */
  const endRef = useRef<HTMLDivElement>(null);
  const isEnd = useIntersection(endRef, "500px");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasScrolled(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isEnd || !hasScrolled || query.isFetchingNextPage || query.isPending) {
      return;
    } else if (query.hasNextPage) {
      void query.fetchNextPage();
    }
  }, [isEnd, query, hasScrolled]);

  return (
    <div>
      <section className="space-y-5 p-3">
        <PostForm submit={createPost.mutate} />

        {query.isPending && (
          <p className="animate-pulse text-center">
            <span className="loading me-2 loading-xs" />
            Loading post...
          </p>
        )}

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

        <div ref={endRef} />
      </section>
    </div>
  );
}

export default Feed;
