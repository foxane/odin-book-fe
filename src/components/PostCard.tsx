import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
}

export default function PostCard({ post, ...props }: Props) {
  return (
    <div
      className={twMerge("card bg-base-300 p-2", props.className)}
      {...props}
    >
      <div className="avatar w-10">
        <img src={post.user.avatar ?? ""} alt={`${post.user.name} avatar`} />
      </div>

      <div dangerouslySetInnerHTML={{ __html: post.text }} />
    </div>
  );
}
