import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
}

export default function PostCard({ post, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "card -z-10 p-3 shadow-2xl",
        post.isPending && "animate-pulse",
        props.className,
      )}
      {...props}
    >
      <div className="card-title">
        <p>{post.user.name}</p>
        <p className="text-xs font-normal">{post.createdAt}</p>
        {post.isPending && <span>Loading...</span>}
      </div>
      <div className="card-body">
        <div dangerouslySetInnerHTML={{ __html: post.text }} />
      </div>

      <div className="card-actions">{props.children}</div>
    </div>
  );
}
