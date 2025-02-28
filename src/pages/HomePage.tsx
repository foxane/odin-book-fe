import { useInfiniteQuery } from "@tanstack/react-query";
import PostForm from "../components/post/PostForm";
import { postService } from "../utils/services";
import PostCard from "../components/post/PostCard";
import usePostMutation from "../hooks/usePostInfinite";
import { useState } from "react";
import PollForm from "../components/PollForm";

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
    </div>
  );
}
