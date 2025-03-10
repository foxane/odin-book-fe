import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import { DeleteModal, UpdateModal } from "../common/Modal";
import useCommentInfinite from "../../hooks/useCommentInfnite";
import CommentCard from "./CommentCard";
import InfiniteScrollObserver from "../common/InfiniteScrollObserver";

interface Props {
  query: UseInfiniteQueryResult<InfiniteComment>;
  queryKey: unknown[];
}

function CommentList({ query, queryKey }: Props) {
  const { deleteComment, likeComment, updateComment } =
    useCommentInfinite(queryKey);

  const [toDelete, setToDelete] = useState<IComment | null>(null);
  const [toUpdate, setToUpdate] = useState<IComment | null>(null);

  const comments = query.data?.pages.flat() ?? [];
  return (
    <section className="space-y-4">
      {comments.map((el) => (
        <CommentCard
          comment={el}
          key={el.id}
          delete={() => setToDelete(el)}
          update={() => setToUpdate(el)}
          like={() => likeComment.mutate(el)}
        />
      ))}

      {toUpdate && (
        <UpdateModal
          data={toUpdate}
          onClose={() => setToUpdate(null)}
          submit={(data) => updateComment.mutate(data as IComment)}
        />
      )}

      {toDelete && (
        <DeleteModal
          data={toDelete}
          onClose={() => setToDelete(null)}
          submit={() => deleteComment.mutate(toDelete)}
        />
      )}

      <InfiniteScrollObserver query={query} />
    </section>
  );
}

export default CommentList;
