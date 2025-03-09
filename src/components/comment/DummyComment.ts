export default class DummyComment implements IComment {
  createdAt = new Date();
  id = Date.now();
  isLiked = false;
  media = [];
  _count = { likedBy: 0, comment: 0 };
  updatedAt = null;
  status?: "create" | "update" | "delete" | undefined = "create";
  text: string;
  user: Pick<User, "id" | "name" | "avatar" | "lastSeen">;
  userId: number;
  postId: number;

  constructor(text: string, user: User, postId: number) {
    this.postId = postId;
    this.text = text;
    this.user = user;
    this.userId = user.id;
  }
}
