import { useInfiniteQuery } from "@tanstack/react-query";
import { postService } from "../../utils/services";
import PostCard from "../../components/post/PostCard";
import usePostMutation from "../../hooks/usePostInfinite";
import PostSkeleton from "../../components/post/PostSkeleton";

export default function PostSection({ userId }: { userId: string }) {
  const query = useInfiniteQuery({
    queryKey: ["post", userId],
    initialPageParam: "",
    queryFn: ({ pageParam }) => postService.getByUser(userId, pageParam),
    getNextPageParam: (prevPage) => {
      if (prevPage.length < 10) return undefined;
      else return prevPage.at(-1)?.id.toString();
    },
  });
  const posts = query.data?.pages.flat() ?? [];
  const { likePost, deletePost, updatePost } = usePostMutation([
    "post",
    userId,
  ]);

  return (
    <section className="space-y-2">
      {query.isPending &&
        new Array(3).fill("").map((_, i) => <PostSkeleton key={i} />)}

      {posts.map((el) => (
        <PostCard
          action={{ like: likePost, delete: deletePost, update: updatePost }}
          post={el}
          key={el.id}
        />
      ))}

      <div className="mx-auto my-6 w-fit">
        {query.hasNextPage ? (
          <button
            disabled={query.isFetchingNextPage}
            className="btn btn-primary btn-sm"
            onClick={() => void query.fetchNextPage()}
          >
            {query.isFetchingNextPage ? (
              <span className="loading" />
            ) : (
              "Load more post"
            )}
          </button>
        ) : (
          <p>No more post</p>
        )}
      </div>
    </section>
  );
}
