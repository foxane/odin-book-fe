import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { commentService, postService } from "../utils/services";
import PostCard from "../components/post/PostCard";
import { usePostSingle } from "../hooks/usePostSingle";
import CommentCard from "../components/commet/CommentCard";
import CommentForm from "../components/commet/CommentForm";
import useCommentInfinite from "../hooks/useCommentInfinite";

export default function PostPage() {
  const { postId = "" } = useParams();

  const postKey = ["post", postId];
  const postAction = usePostSingle(postKey);
  const postQuery = useQuery({
    queryKey: postKey,
    queryFn: () => postService.getOne(postId),
  });

  const commentKey = ["comment", { postId }];
  const { createComment, deleteComment, likeComment, updateComment } =
    useCommentInfinite(commentKey);
  const commentQuery = useInfiniteQuery({
    queryKey: commentKey,
    initialPageParam: "",
    queryFn: ({ pageParam }) => commentService.getMany(postId, pageParam),
    getNextPageParam: (prevPage) => {
      if (prevPage.length < 10) return undefined;
      else return prevPage.at(-1)?.id.toString();
    },
  });

  /* TODO: Add loading state for post and comment */
  if (!postQuery.data) return <div className="loading"></div>;
  return (
    <div className="pb-10">
      <PostCard post={postQuery.data} action={postAction} />

      <div className="divider" />

      <CommentForm post={postQuery.data} submit={createComment} />

      <div className="divider" />

      {commentQuery.data?.pages.map((page, i) => (
        <section className="space-y-2" key={i}>
          {page.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              action={{
                update: updateComment,
                like: likeComment,
                delete: deleteComment,
              }}
            />
          ))}
        </section>
      ))}

      {commentQuery.hasNextPage && (
        <button
          disabled={commentQuery.isFetchingNextPage}
          className="btn mx-auto"
          onClick={() => void commentQuery.fetchNextPage()}
        >
          Load more
        </button>
      )}
    </div>
  );
}
