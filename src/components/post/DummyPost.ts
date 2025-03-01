export class DummyPost implements Post {
  id: number = Date.now();
  createdAt: string = new Date().toISOString();
  text: string;
  user: User;
  userId: number;
  isLiked = false;
  media: string[] = [];
  _count = {
    likedBy: 0,
    comment: 0,
  };

  isPending?: boolean = true;
  status: "create" | "update" | "delete" = "create";

  constructor(text: FormDataEntryValue, user: User) {
    this.text = text as string;
    this.user = user;
    this.userId = user.id;
  }
}
