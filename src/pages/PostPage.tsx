import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { commentService, postService } from "../utils/services";
import PostCard from "../components/post/PostCard";
import { usePostSingle } from "../hooks/usePostSingle";
import CommentCard from "../components/commet/CommentCard";
import CommentForm from "../components/commet/CommentForm";
import { ArrowLeftIcon } from "lucide-react";
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
  const commentAction = useCommentInfinite(commentKey);
  const commentQuery = useInfiniteQuery({
    queryKey: commentKey,
    initialPageParam: "",
    queryFn: ({ pageParam }) => commentService.getMany(postId, pageParam),
    getNextPageParam: (prevPage) => {
      if (prevPage.length < 10) return undefined;
      else return prevPage.at(-1)?.id.toString();
    },
  });

  const navigate = useNavigate();

  /* TODO: Add loading state for post and comment */
  if (!postQuery.data) return <div className="loading"></div>;
  return (
    <div className="pb-10">
      <div className="mb-3 flex items-center gap-3">
        <button
          className="btn border-base-content/20"
          onClick={() => void navigate(-1)}
        >
          <ArrowLeftIcon />
        </button>
        <p>Go back</p>
      </div>

      <PostCard post={postQuery.data} action={postAction} />

      <div className="divider" />

      <CommentForm post={postQuery.data} submit={commentAction.create} />

      <div className="divider" />

      {commentQuery.data?.pages.map((page, i) => (
        <section className="space-y-2" key={i}>
          {page.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              action={commentAction}
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
