import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { getCommentByPost } from "../../services/comment";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import useCommentMutation from "./useCommentMutation";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
}

export default function CommentFeed({ post, className, ...props }: Props) {
  const QUERY_KEY = ["comments", { postId: post.id }];
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getCommentByPost(post),
  });

  const { create, update, remove, like } = useCommentMutation(QUERY_KEY);

  /**
   * Action passed to CommentCard
   */
  const action = {
    update: update.mutate as MutateFn,
    delete: remove.mutate as MutateFn,
    like: like.mutate as MutateFn,
  };

  return (
    <div className={twMerge("pb-3", className)} {...props}>
      <div className="divider">Comments</div>

      <CommentForm post={post} submit={create.mutate} />

      <section className="space-y-2">
        {/* <p>{createComment.variables?.c.text}</p> */}
        {query.data?.map((el) => (
          <CommentCard action={action} comment={el} key={el.id} />
        ))}

        {query.isPending && (
          <p className="animate-pulse pt-6 text-center">
            <span className="loading me-2 loading-sm" />
            Loading comment...
          </p>
        )}
        {query.isFetched && query.data?.length === 0 && (
          <p className="flex items-center justify-center pt-6">No comment</p>
        )}
      </section>
    </div>
  );
}
