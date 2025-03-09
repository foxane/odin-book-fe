import { useNavigate, useParams } from "react-router-dom";
import { RouteParams } from "../../App";
import PostCard from "../../components/post/PostCard";
import PostSkeleton from "../../components/post/PostSkeleton";
import CommentCard from "../../components/comment/CommentCard";
import {
  useCommentMutation,
  useCommentQuery,
  usePostMutation,
  usePostQuery,
} from "../../hooks/usePostPage";
import { isComment } from "../../utils/helpers";
import CommentForm from "../../components/comment/CommentForm";
import { useState } from "react";
import { DeleteModal, UpdateModal } from "../../components/common/Modal";

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
  const { deletePost, likePost, updatePost } = usePostMutation(postKey);
  const { deleteComment, likeComment, updateComment } =
    useCommentMutation(commentKey);

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
      <p>Post page for {postId}</p>

      <PostCard
        post={postQuery.data}
        like={() => likePost(postQuery.data)}
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
              like={() => likeComment(el)}
            />
          ))}
      </section>

      <DeleteModal
        data={toDelete}
        onClose={() => setToDelete(null)}
        submit={() => {
          if (!toDelete) return console.log("Deleting non-existent data");
          if (isComment(toDelete)) void deleteComment(toDelete);
          else {
            void deletePost(toDelete);
            void navigate("/", { replace: true });
          }
        }}
      />

      <UpdateModal
        data={toUpdate}
        onClose={() => setToUpdate(null)}
        submit={() => {
          if (!toUpdate) return console.log("Deleting non-existent data");
          if (isComment(toUpdate)) void updateComment(toUpdate);
          else void updatePost(toUpdate);
        }}
      />
    </div>
  );
}

export default PostPage;
