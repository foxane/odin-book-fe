import { UseInfiniteQueryResult } from "@tanstack/react-query";
import PostCard from "./PostCard";
import usePostInfinite from "../../hooks/usePostInfinite";
import { useState } from "react";
import { DeleteModal, UpdateModal } from "../common/Modal";

interface Props {
  query: UseInfiniteQueryResult<InfinitePost>;
  queryKey: unknown[];
}

function PostList({ query, queryKey }: Props) {
  const { deletePost, likePost, updatePost } = usePostInfinite(queryKey);

  const [toDelete, setToDelete] = useState<Post | null>(null);
  const [toUpdate, setToUpdate] = useState<Post | null>(null);

  const posts = query.data?.pages.flat() ?? [];

  return (
    <section className="space-y-4">
      {posts.map((el) => (
        <PostCard
          post={el}
          key={el.id}
          delete={() => setToDelete(el)}
          update={() => setToUpdate(el)}
          like={() => likePost.mutate(el)}
        />
      ))}

      {toUpdate && (
        <UpdateModal
          data={toUpdate}
          onClose={() => setToUpdate(null)}
          submit={(data) => updatePost.mutate(data)}
        />
      )}

      {toDelete && (
        <DeleteModal
          data={toDelete}
          onClose={() => setToDelete(null)}
          submit={() => deletePost.mutate(toDelete)}
        />
      )}
    </section>
  );
}

export default PostList;
