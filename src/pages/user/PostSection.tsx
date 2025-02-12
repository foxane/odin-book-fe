import { useQuery } from "@tanstack/react-query";
import { postService } from "../../utils/services";
import PostCard from "../../components/post/PostCard";

export default function PostSection({ userId }: { userId: string }) {
  const query = useQuery({
    queryKey: ["posts", userId],
    queryFn: () => postService.getByUser(userId),
  });

  return (
    <section className="space-y-2">
      {query.data?.map((el) => <PostCard post={el} key={el.id} />)}
    </section>
  );
}
