import { useQuery } from "@tanstack/react-query";
import { getAllPost } from "../../services/post";
import PostCard from "../../components/post/PostCard";
import useFeedMutation from "./useFeedMutation";

function Feed() {
  const query = useQuery({ queryKey: ["posts"], queryFn: getAllPost });
  const { likePost, deletePost, updatePost } = useFeedMutation(["posts"]);

  return (
    <div>
      {query.data?.map((el) => (
        <PostCard
          post={el}
          key={el.id}
          action={{
            update: updatePost.mutate,
            like: likePost.mutate,
            delete: deletePost.mutate,
          }}
        />
      ))}
    </div>
  );
}

export default Feed;
