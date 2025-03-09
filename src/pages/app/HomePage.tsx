import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../utils/services";
import {
  DEFAULT_API_CURSOR_LIMIT as LIMIT,
  QUERY_KEY,
} from "../../utils/constants";
import PostCard from "../../components/post/PostCard";
import PostForm from "../../components/post/PostForm";
import { DeleteModal, UpdateModal } from "../../components/common/Modal";
import { useState } from "react";
import usePostInfinite from "../../hooks/usePostInfinite";

function HomePage() {
  const postQuery = useInfiniteQuery({
    queryKey: QUERY_KEY.posts,
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      return (await api.axios.get<Post[]>(`/posts?cursor=${pageParam}`)).data;
    },
    getNextPageParam: (page) => {
      if (page.length < LIMIT) return undefined;
      else return page.at(-1)!.id.toString();
    },
  });

  /**
   * Mutation fns
   */
  const { likePost, deletePost, updatePost } = usePostInfinite(QUERY_KEY.posts);

  /**
   * Modal state
   */
  const [toDelete, setToDelete] = useState<Post | null>(null);
  const [toUpdate, setToUpdate] = useState<Post | null>(null);

  return (
    <div className="space-y-6">
      <PostForm />

      <section className="space-y-4">
        {postQuery.data?.pages
          .flat()
          .map((el) => (
            <PostCard
              post={el}
              key={el.id}
              like={() => likePost.mutate(el)}
              update={() => setToUpdate(el)}
              delete={() => setToDelete(el)}
            />
          ))}
      </section>

      <DeleteModal
        data={toDelete}
        submit={() => deletePost.mutate(toDelete!)}
        onClose={() => setToDelete(null)}
      />

      {toUpdate && (
        <UpdateModal
          data={toUpdate}
          submit={(data) => updatePost.mutate(data)}
          onClose={() => setToUpdate(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
