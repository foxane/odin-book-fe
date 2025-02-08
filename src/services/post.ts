import { removePTag } from "../lib/utils";
import api from "./api";

export const getAllPost = async () => {
  const { data } = await api.axios.get<Post[]>("/posts");
  return data;
};

export const createPost = async (p: PostPayload) => {
  const { data } = await api.axios.post<Post>("/posts", p);
  return data;
};

export const likePost = async (p: Post) => {
  const endpoint = `/posts/${p.id.toString()}/like`;

  if (p.isLiked) await api.axios.delete(endpoint);
  else await api.axios.post(endpoint);
};

export const updatePost = async (payload: Post) => {
  const { data } = await api.axios.put<Post>(
    `/posts/${payload.id.toString()}`,
    { text: removePTag(payload.text) },
  );
  return data;
};

export const deletePost = async (post: Post) => {
  await api.axios.delete(`/posts/${post.id.toString()}`);
};

export const getFeed = async (cursor: string) => {
  const { data } = await api.axios.get<Post[]>(`/posts?cursor=${cursor}`);
  return data;
};
