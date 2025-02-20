interface Credentials {
  name?: string;
  email: string;
  password: string;
}

interface UserUpdatePayload {
  name: string;
  email: string;
  bio: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  bio: null | string;
  avatar: null | string;
  background: null | string;
  role: "GUEST" | "USER" | "ADMIN";
  isFollowed: boolean;
  _count: {
    follower: number;
    following: number;
  };
}

interface IAuthContext {
  user: User | null;
  login: (cred: Credentials) => void;
  register: (cred: Credentials) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  error: AuthError | null;
  loading: boolean;
}

interface AuthZustand extends IAuthContext {
  load: () => void;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthError {
  message: string;
  errorDetails?: string[];
}

interface Post {
  id: number;
  createdAt: string;
  text: string;
  user: User;
  userId: string;
  isLiked: boolean;
  media: string[];
  _count: {
    likedBy: number;
    comment: number;
  };

  /**
   * Frontend only props
   */
  isPending?: boolean; // Mutation state
  status?: "create" | "update" | "delete"; // Mutation action
}

interface PostPayload {
  text: string;
  media: File | null;
}

interface IComment extends Post {
  id: number;
  postId: number;
  createdAt: string;
  text: string;
  user: User;
  userId: string;
  isLiked: boolean;
  _count: {
    likedBy: number;
  };

  /**
   * Frontend only props
   */
  isPending?: boolean; // Mutation state
  status?: "create" | "update" | "delete"; // Mutation action
}

interface CommentPayload {
  text: string;
}

/**
 * ================ Notification ===================
 */
type NotifType =
  | "follower"
  | "post_from_followed"
  | "post_liked"
  | "post_commented"
  | "comment_liked";

interface INotification {
  id: number;
  isRead: boolean;
  type: NotifType;
  date: Date;
  receiverId: string;
  actorId: string;
  actor: User;
  post?: Post | null;
  postId?: number | null;
  comment?: Comment | null;
  commentId?: number | null;
}

/**
 * =============== SOCKET ==================
 */

interface ClientToServerEvents {
  sendMessage: (e: { text: string; image? }) => void;
}

interface ServerToClientEvents {
  newMessage: (e: { text: string; image? }) => void;
}

/**
 * =============== CHAT ===================
 */

interface Room {
  id: number;
  users: User[];
  messages: Message[];
}

interface Message {
  id: number;
  text?: string | null;
  media: string[];
  createdAt: Date;
  Room?: Room | null;
  roomId?: number | null;
  User?: User | null;
  userId?: string | null;
  MessageStatus: MessageStatus[];
}

interface MessageStatus {
  status: MsgStatus;
  messageId: number;
  Message: Message;
  User: User;
  userId: string;
}

type MsgStatus = "DELIVERED" | "READ";
