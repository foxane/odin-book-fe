export default class DummyComment implements IComment {
  id: number = Date.now();
  postId: number;
  createdAt: string = new Date().toISOString();
  text: string;
  user: User;
  userId: string;
  isLiked = false;
  _count = {
    likedBy: 0,
    comment: 0,
  };

  isPending?: boolean = true;
  status: "create" | "update" | "delete" = "create";

  constructor(text: string, user: User, postId: number) {
    this.text = text;
    this.user = user;
    this.userId = user.id;
    this.postId = postId;
  }
}
