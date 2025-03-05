type NotifType =
  | "follower"
  | "post_from_followed"
  | "post_liked"
  | "post_commented"
  | "comment_liked";

type Role = "ADMIN" | "USER" | "GUEST";

type MsgStatus = "UNREAD" | "READ";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string | null;
  avatar?: string | null;
  background?: string | null;
  bio?: string | null;
  createdAt: Date;
  provider?: OAuth | null;
  role: Role;
  follower: User[];
  following: User[];
  post: Post[];
  comment: Comment[];
  likedPost: Post[];
  likedComment: Comment[];
  chat: Chat[];
  message: Message[];
  notif_donotuse: Notification[];
}

export interface OAuth {
  id: string;
  user: User;
  userId: number;
  provider: string;
}

export interface Post {
  id: number;
  text: string;
  media: string[];
  createdAt: Date;
  updatedAt: Date;
  likedBy: User[];
  comment: Comment[];
  user: User;
  userId: number;
  notif_donotuse: Notification[];
}

export interface Comment {
  id: number;
  text: string;
  media: string[];
  createdAt: Date;
  updatedAt: Date;
  likedBy: User[];
  user: User;
  userId: number;
  post: Post;
  postId: number;
  notif_donotuse: Notification[];
}

export interface Notification {
  id: number;
  isRead: boolean;
  type: NotifType;
  date: Date;
  receiverId: number;
  actorId: number;
  actor: User;
  post?: Post | null;
  postId?: number | null;
  comment?: Comment | null;
  commentId?: number | null;
}

export interface Chat {
  id: number;
  member: User[];
  message: Message[];
}

export interface Message {
  id: number;
  createdAt: Date;
  status: MsgStatus;
  readAt?: Date | null;
  text?: string | null;
  media: string[];
  userId: number;
  user: User;
  chat?: Chat | null;
  chatId?: number | null;
}
