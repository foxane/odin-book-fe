type Role = "ADMIN" | "USER" | "GUEST";

type MsgStatus = "UNREAD" | "READ";

type NotifType =
  | "follower"
  | "post_from_followed"
  | "post_liked"
  | "post_commented"
  | "comment_liked";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  background?: string | null;
  bio?: string | null;
  createdAt: Date;
  provider?: OAuth | null;
  role: Role;
}

interface OAuth {
  id: string;
  user: User;
  userId: number;
  provider: string;
}
