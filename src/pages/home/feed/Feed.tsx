import { useQuery } from "@tanstack/react-query";
import { getAllPost } from "../../../services/post";
import PostCard from "./PostCard";

export default function Feed() {
  const query = useQuery({ queryKey: ["posts"], queryFn: getAllPost });

  return (
    <section>
      {query.data?.map((post) => (
        <PostCard post={post} key={post.id}></PostCard>
      ))}
    </section>
  );
}
