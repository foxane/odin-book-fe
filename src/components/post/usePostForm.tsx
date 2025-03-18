import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../context/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import DummyPost from "../../classes/Post";
import { api } from "../../utils/services";
import { QUERY_KEY } from "../../utils/constants";

export interface PostPayload {
  text: string;
  image?: FileList;
}

export default function usePostForm() {
  const client = useQueryClient();
  const user = useAuth((s) => s.user)!;
  const { register, handleSubmit, watch, reset, resetField, formState } =
    useForm<PostPayload>({ defaultValues: { text: "" } });

  const onSubmit: SubmitHandler<PostPayload> = async (data) => {
    const payload = new FormData();
    payload.append("text", data.text);
    if (data.image) payload.append("user-upload", data.image[0]);

    /**
     * Update cache before submitting
     */
    const prevData = client.getQueryData<InfinitePost>(QUERY_KEY.posts);
    const dummyPost = new DummyPost(data, user);
    client.setQueryData(QUERY_KEY.posts, (old: InfinitePost | undefined) =>
      !old
        ? old
        : {
            ...old,
            pages: [[dummyPost, ...old.pages[0]], ...old.pages.slice(1)],
          },
    );

    try {
      const { data: post } = await api.axios.post<Post>("/posts", payload);
      dummyPost.media.forEach((src) => URL.revokeObjectURL(src));

      /**
       * Change dummy to actual data
       */
      client.setQueryData(QUERY_KEY.posts, (old: InfinitePost | undefined) =>
        !old
          ? old
          : {
              ...old,
              pages: [
                old.pages[0].map((el) => (el.id === dummyPost.id ? post : el)),
                ...old.pages.slice(1),
              ],
            },
      );
      reset();
    } catch (error) {
      alert("Failed to create post!");
      console.log(error);
      client.setQueryData(QUERY_KEY.posts, prevData);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    resetField,
    formState,
  };
}
