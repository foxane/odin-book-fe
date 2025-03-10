import { useNavigate, useParams } from "react-router-dom";
import { RouteParams } from "../../App";
import PostCard from "../../components/post/PostCard";
import PostSkeleton from "../../components/post/PostSkeleton";
import { useCommentQuery, usePostQuery } from "./usePostPage";
import CommentForm from "../../components/comment/CommentForm";
import { useState } from "react";
import { DeleteModal, UpdateModal } from "../../components/common/Modal";
import usePostSingle from "../../hooks/usePostSingle";
import CommentList from "../../components/comment/CommentList";

function PostPage() {
  const postId = useParams<RouteParams>().postId!;
  const navigate = useNavigate();

  /**
   * Queries data
   */
  const postKey = ["post", postId];
  const postQuery = usePostQuery(postKey);
  const commentKey = ["comments", postId];
  const commentQuery = useCommentQuery(commentKey);

  /**
   * Mutations
   */
  const { deletePost, likePost, updatePost } = usePostSingle(postKey);

  /**
   * Control modal visibility based this 2 state
   */
  const [toUpdate, setToUpdate] = useState<Post | null>(null);
  const [toDelete, setToDelete] = useState<Post | null>(null);

  if (postQuery.isError) {
    return <p>{postQuery.error.message}</p>;
  }

  if (!postQuery.data) {
    return <PostSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PostCard
        post={postQuery.data}
        like={() => likePost.mutate(postQuery.data)}
        delete={() => setToDelete(postQuery.data)}
        update={() => setToUpdate(postQuery.data)}
      />

      <CommentForm postId={postId} />
      <CommentList query={commentQuery} queryKey={commentKey} />

      {toDelete && (
        <DeleteModal
          data={toDelete}
          onClose={() => setToDelete(null)}
          submit={() => {
            deletePost.mutate(toDelete);
            void navigate("/", { replace: true });
          }}
        />
      )}

      {toUpdate && (
        <UpdateModal
          data={toUpdate}
          onClose={() => setToUpdate(null)}
          submit={(data: IComment | Post) => updatePost.mutate(data)}
        />
      )}

      {commentQuery.isPending &&
        Array(10)
          .fill("")
          .map((_, i) => <PostSkeleton key={i} />)}
    </div>
  );
}

export default PostPage;
