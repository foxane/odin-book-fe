import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { getCommentByPost } from "../../services/comment";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
}

export default function CommentFeed({ post, className, ...props }: Props) {
  const query = useQuery({
    queryKey: ["comments", { postId: post.id }],
    queryFn: () => getCommentByPost(post),
  });

  return (
    <div className={twMerge("pb-3", className)} {...props}>
      <div className="divider">Comments</div>

      <CommentForm post={post} query={query} />

      <section className="space-y-2">
        {query.data?.map((el) => <CommentCard comment={el} key={el.id} />)}

        <div className="card-body h-5 text-center">
          {query.isPending && (
            <p className="animate-pulse">
              <span className="loading me-2 loading-sm" />
              Loading comment...
            </p>
          )}
          {query.isFetched && query.data?.length === 0 && <p>No comment</p>}
        </div>
      </section>
    </div>
  );
}
