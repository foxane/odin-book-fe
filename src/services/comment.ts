/* eslint-disable @typescript-eslint/restrict-template-expressions */
import api from "./api";

const base = (i: IComment | Post) => {
  let postId: number;
  if ("postId" in i) postId = i.postId;
  else postId = i.id;

  return `/posts/${postId}/comments`;
};

export const getCommentByPost = async (post: Post, cursor?: number) => {
  const { data } = await api.axios.get<IComment[]>(
    `${base(post)}?cursor=${cursor ?? ""}`,
  );
  return data;
};

export const createComment = async (c: CommentPayload, p: Post) => {
  const { data } = await api.axios.post<Comment>(base(p), c);
  return data;
};

export const likeComment = async (c: IComment) => {
  const endpoint = `${base(c)}/${c.id}/like`;

  if (c.isLiked) await api.axios.delete(endpoint);
  else await api.axios.post(endpoint);
};

export const updateComment = async (c: IComment) => {
  const { data } = await api.axios.put<IComment>(`${base(c)}/${c.id}`, {
    text: c.text,
  });
  return data;
};

export const deleteComment = async (c: IComment) => {
  await api.axios.delete(`${base(c)}/${c.id}`);
};
