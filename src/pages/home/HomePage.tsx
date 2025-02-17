import { useInfiniteQuery } from "@tanstack/react-query";
import PostForm from "../../components/post/PostForm";
import { postService } from "../../utils/services";
import PostCard from "../../components/post/PostCard";
import { usePostInfinite } from "../../hooks/usePostInfinite";

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
  const mutation = usePostInfinite(["posts"]);
  const posts = query.data?.pages.flat() ?? [];

  return (
    <div className="space-y-2">
      <PostForm submit={mutation.create} />

      {posts.map((post) => (
        <PostCard
          action={{
            delete: mutation.delete,
            like: mutation.like,
            update: mutation.update,
          }}
          post={post}
          key={post.id}
        />
      ))}
    </div>
  );
}
