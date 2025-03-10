import { useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import DummyComment from "./DummyComment";
import { cancelAndGetPrev } from "../../utils/helpers";
import useAuth from "../../context/AuthContext";
import { api } from "../../utils/services";

export interface CommentPayload {
  text: string;
}

export default function useCommentForm(postId: string) {
  const queryKey = ["comments", postId];
  const client = useQueryClient();
  const user = useAuth((s) => s.user)!;

  const { register, handleSubmit, formState, watch } =
    useForm<CommentPayload>();

  const onSubmit: SubmitHandler<CommentPayload> = async (payload) => {
    const dummy = new DummyComment(payload.text, user, Number(postId));
    const prevData = await cancelAndGetPrev<InfiniteComment>(client, queryKey);

    client.setQueryData(queryKey, (old: InfiniteComment | undefined) =>
      old
        ? { ...old, pages: [[dummy, ...old.pages[0]], ...old.pages.slice(1)] }
        : old,
    );

    try {
      const { data } = await api.axios.post<IComment>(
        `/posts/${postId}/comments`,
        payload,
      );
      client.setQueryData(queryKey, (old: InfiniteComment | undefined) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) =>
                page.map((el) => (el.id === dummy.id ? data : el)),
              ),
            }
          : old,
      );
    } catch (error) {
      console.log(error);
      alert("Error handler for creating comment is not set");
      client.setQueryData(queryKey, prevData);
    }
  };

  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    formState,
    watch,
  };
}
