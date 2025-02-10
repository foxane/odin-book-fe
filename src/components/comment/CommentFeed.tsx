import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { getCommentByPost } from "../../services/comment";
import CommentForm from "./CommentForm";
import useCommentMutation from "./useCommentMutation";
import { useState } from "react";
import CommentCard from "./CommentCard";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
}

export default function CommentFeed({ post, className, ...props }: Props) {
  const [commentForm, setCommentForm] = useState(false);
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
    <div className={twMerge("", className)} {...props}>
      <div className="divider"></div>

      {commentForm ? (
        <CommentForm
          post={post}
          submit={create.mutate}
          cancel={() => setCommentForm(false)}
        />
      ) : (
        <input
          placeholder="Create comment"
          className="input w-full rounded-xl"
          readOnly
          onClick={() => setCommentForm(true)}
        />
      )}

      <section className="space-y-3 rounded pt-5">
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
