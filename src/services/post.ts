import { removePTag } from "../lib/utils";
import api from "./api";

export const getAllPost = async () => {
  const { data } = await api.axios.get<Post[]>("/posts?sort=date");
  return data;
};

export const createPost = async (p: PostPayload) => {
  const { data } = await api.axios.post<Post>("/posts", p);
  return data;
};

export const likePost = async (p: Post) => {
  const endpoint = `/posts/${p.id.toString()}/like`;

  if (p.isLiked) await api.axios.post(endpoint);
  else await api.axios.delete(endpoint);
};

export const updatePost = async (payload: Post) => {
  const { data } = await api.axios.put<Post>(
    `/posts/${payload.id.toString()}`,
    { text: removePTag(payload.text) },
  );
  return data;
};

export const deletePost = async (id: number) => {
  await api.axios.delete(`/posts/${id.toString()}`);
};
