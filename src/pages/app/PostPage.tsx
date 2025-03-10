import { useNavigate, useParams } from "react-router-dom";
import { RouteParams } from "../../App";
import PostCard from "../../components/post/PostCard";
import PostSkeleton from "../../components/post/PostSkeleton";
import CommentCard from "../../components/comment/CommentCard";
import { useCommentQuery, usePostQuery } from "../../hooks/usePostPage";
import { isComment } from "../../utils/helpers";
import CommentForm from "../../components/comment/CommentForm";
import { useState } from "react";
import { DeleteModal, UpdateModal } from "../../components/common/Modal";
import useCommentInfinite from "../../hooks/useCommentInfnite";
import usePostSingle from "../../hooks/usePostSingle";

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
  const { deleteComment, likeComment, updateComment } =
    useCommentInfinite(commentKey);

  /**
   * Control modal visibility based this 2 state
   */
  const [toUpdate, setToUpdate] = useState<Post | IComment | null>(null);
  const [toDelete, setToDelete] = useState<Post | IComment | null>(null);

  if (!postQuery.data && postQuery.isError) {
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

      <section className="space-y-2">
        {commentQuery.data?.pages
          .flat()
          .map((el) => (
            <CommentCard
              comment={el}
              key={el.id}
              like={() => likeComment.mutate(el)}
              delete={() => setToDelete(el)}
              update={() => setToUpdate(el)}
            />
          ))}
      </section>

      {toDelete && (
        <DeleteModal
          data={toDelete}
          onClose={() => setToDelete(null)}
          submit={() => {
            if (isComment(toDelete)) deleteComment.mutate(toDelete);
            else {
              deletePost.mutate(toDelete);
              void navigate("/", { replace: true });
            }
          }}
        />
      )}

      {toUpdate && (
        <UpdateModal
          data={toUpdate}
          onClose={() => setToUpdate(null)}
          submit={(data: IComment | Post) => {
            if (isComment(data)) updateComment.mutate(data);
            else updatePost.mutate(data);
          }}
        />
      )}
    </div>
  );
}

export default PostPage;
