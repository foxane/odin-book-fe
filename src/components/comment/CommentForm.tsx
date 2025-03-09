import { SubmitHandler, useForm } from "react-hook-form";
import { optimistic } from "../../utils/helpers";
import { useQueryClient } from "@tanstack/react-query";
import DummyComment from "./DummyComment";
import useAuth from "../../context/AuthContext";
import { api } from "../../utils/services";

export interface CommentPayload {
  text: string;
}

function CommentForm({ postId }: { postId: string }) {
  const client = useQueryClient();
  const user = useAuth((s) => s.user)!;

  const { register, handleSubmit } = useForm<CommentPayload>();
  const onSubmit: SubmitHandler<CommentPayload> = (data) => {
    const dummy = new DummyComment(data.text, user, Number(postId));
    const create = optimistic<InfiniteComment, []>({
      client,
      queryKey: ["comments", postId],
      update: (old) => ({
        ...old,
        pages: [[dummy, ...old.pages[0]], ...old.pages.slice(1)],
      }),
      apiCall: async () =>
        await api.axios.post(`/posts/${postId}/comments`, data),
    });

    void create();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          className="textarea"
          {...register("text", {
            required: "Comment cannot be empty",
            minLength: {
              value: 3,
              message: "comment need to be at least 3 character",
            },
            maxLength: {
              value: 300,
              message: "comment cannot exceed 300 characters",
            },
          })}
        />

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default CommentForm;
