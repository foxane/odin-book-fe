import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../context/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import DummyPost from "./DummyPost";
import { api } from "../../utils/services";

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
    const prevData = client.getQueryData<InfinitePost>(["posts"]);
    const dummyPost = new DummyPost(data, user);
    client.setQueryData(["posts"], (oldData: InfinitePost) => ({
      ...oldData,
      pages: [[dummyPost, ...oldData.pages[0]], ...oldData.pages.slice(1)],
    }));

    try {
      const { data: post } = await api.axios.post<Post>("/posts", payload);
      dummyPost.media.forEach((src) => URL.revokeObjectURL(src));
      client.setQueryData(["posts"], (oldData: InfinitePost) => ({
        ...prevData,
        pages: [[post, ...prevData!.pages[0]], ...oldData.pages.slice(1)],
      }));
      reset();
    } catch (error) {
      console.log(error);
      client.setQueryData(["posts"], prevData);
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
