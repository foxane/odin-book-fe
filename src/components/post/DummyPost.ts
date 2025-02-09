export class DummyPost implements Post {
  id: number = Date.now();
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

  constructor(text: string, user: User) {
    this.text = text;
    this.user = user;
    this.userId = user.id;
  }
}
