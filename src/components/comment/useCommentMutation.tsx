import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as service from "../../services/comment";
import useAuth from "../../hooks/useAuth";
import DummyComment from "./DummyComment";

function useCommentMutation(queryKey: readonly unknown[]) {
  const { user } = useAuth();
  const client = useQueryClient();

  if (!user) throw new Error("useComentMutation dont have user!");

  const getPrev = async () => {
    await client.cancelQueries({ queryKey });
    return client.getQueryData(queryKey);
  };

  const create = useMutation({
    mutationFn: ({ c, p }: { c: CommentPayload; p: Post }) =>
      service.createComment(c, p),

    onMutate: async ({ c, p }) => {
      const prev = await getPrev();
      client.setQueryData(queryKey, (old: IComment[] | undefined) => {
        return !old ? old : [new DummyComment(c.text, user, p.id), ...old];
      });

      return { prev };
    },

    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),

    onSettled: () => client.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: service.updateComment,

    onMutate: async (cum) => {
      const prev = await getPrev();
      client.setQueryData(queryKey, (old: IComment[] | undefined) => {
        return !old
          ? old
          : old.map((el) =>
              cum.id !== el.id
                ? el
                : { ...el, isPending: true, status: "update", text: cum.text },
            );
      });

      return { prev };
    },

    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
    onSettled: () => client.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: service.deleteComment,
    onMutate: async (cum) => {
      const prev = await getPrev();
      client.setQueryData(queryKey, (old: IComment[] | undefined) => {
        return !old
          ? old
          : old.map((el) =>
              cum.id !== el.id
                ? el
                : { ...el, isPending: true, status: "delete" },
            );
      });
      return { prev };
    },

    onError: (_, __, ctx) =>
      ctx?.prev && client.setQueryData(queryKey, ctx.prev),
    onSettled: () => client.invalidateQueries({ queryKey }),
  });

  const like = useMutation({
    mutationFn: service.likeComment,
    onMutate: async (cum) => {
      const prev = await getPrev();

      const { likedBy } = cum._count;
      const { isLiked } = cum;
      const likeCount = isLiked ? likedBy - 1 : likedBy + 1;
      const updatedComment: IComment = {
        ...cum,
        _count: { likedBy: likeCount },
        isLiked: !isLiked,
      };

      client.setQueryData(queryKey, (old: IComment[] | undefined) => {
        return !old
          ? old
          : old.map((el) => (el.id !== cum.id ? el : updatedComment));
      });

      return { prev };
    },
  });

  return { create, update, remove, like };
}

export default useCommentMutation;
