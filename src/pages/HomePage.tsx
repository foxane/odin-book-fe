import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import PostForm from "../components/post/PostForm";
import { postService } from "../utils/services";
import PostCard from "../components/post/PostCard";
import usePostMutation from "../hooks/usePostInfinite";
import { useState } from "react";
import PollForm from "../components/PollForm";
import PostSkeleton from "../components/post/PostSkeleton";

export default function HomePage() {
  const query = useInfiniteQuery({
    queryKey: ["posts"],
    initialPageParam: "",
    queryFn: ({ pageParam }) => postService.getMany(pageParam),
    getNextPageParam: (prevPage) => {
      if (prevPage.length < 10) return undefined;
      else return prevPage.at(-1)?.id.toString();
    },
  });

  const posts = query.data?.pages.flat() ?? [];
  const { createPost, deletePost, likePost, updatePost } = usePostMutation([
    "posts",
  ]);
  const [isPoll, setIsPoll] = useState(false);

  /**
   * Auto fetch next page observer
   */
  const observerTarget = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (
        target.isIntersecting &&
        query.hasNextPage &&
        !query.isFetchingNextPage
      ) {
        void query.fetchNextPage();
      }
    },
    [query],
  );

  useEffect(() => {
    const element = observerTarget.current;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver, posts.length]);

  return (
    <div className="space-y-3">
      <PostForm submit={createPost} openPoll={() => setIsPoll(true)} />
      <PollForm visible={isPoll} onClose={() => setIsPoll(false)} />

      {posts.map((post) => (
        <PostCard
          action={{
            delete: deletePost,
            like: likePost,
            update: updatePost,
          }}
          post={post}
          key={post.id}
        />
      ))}

      {query.isPending &&
        Array(3)
          .fill("")
          .map((_, i) => <PostSkeleton key={i} />)}

      {query.isFetchingNextPage &&
        Array(3)
          .fill("")
          .map((_, i) => <PostSkeleton key={i} />)}

      {/* Observer target element */}
      {query.hasNextPage && <div ref={observerTarget} className="h-10" />}
    </div>
  );
}
