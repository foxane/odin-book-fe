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
  createdAt: string;
  provider?: OAuth | null;
  role: Role;
  lastSeen: string | null;
  isFollowed: boolean;
}

interface OAuth {
  id: string;
  user: User;
  userId: number;
  provider: string;
}

interface Post {
  id: number;
  text: string;
  media: string[];
  createdAt: string;
  updatedAt: string | null;
  user: Pick<User, "id" | "name" | "avatar" | "lastSeen">;
  userId: number;
  _count: {
    likedBy: number;
    comment: number;
  };
  isLiked: boolean;
}
