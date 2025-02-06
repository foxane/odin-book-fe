export const addPTag = (s: string) =>
  s
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

export const removePTag = (s: string) =>
  s.replace(/<p>/g, "").replace(/<\/p>/g, "\n");

export class DummyPost {
  id = Date.now();
  createdAt = new Date().toISOString();
  isLiked = false;
  _count = {
    likedBy: 0,
  };

  userId: string;
  text: string;
  user: User;

  isPending? = true;

  constructor(text: string, user: User) {
    this.text = text;
    this.user = user;
    this.userId = user.id;
  }
}
