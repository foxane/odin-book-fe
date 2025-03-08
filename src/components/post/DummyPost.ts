import { PostPayload } from "./usePostForm";

export default class DummyPost implements Post {
  createdAt = new Date();
  id = Date.now();
  isLiked = false;
  updatedAt = null;
  _count = {
    likedBy: 0,
    comment: 0,
  };

  media: string[];
  text: string;
  user: Pick<User, "id" | "name" | "avatar" | "lastSeen">;
  userId: number;
  status?: "create" | "update" | "delete" | undefined;

  constructor(payload: PostPayload, user: User) {
    this.status = "create";
    this.text = payload.text;
    this.media = payload.image?.[0]
      ? [URL.createObjectURL(payload.image[0])]
      : [];
    this.user = user;
    this.userId = user.id;
  }
}
