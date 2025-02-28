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
  id: number;
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

// React context ver
interface IAuthContext {
  user: User | null;
  login: (cred: Credentials) => void;
  register: (cred: Credentials) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  error: AuthError | null;
  loading: boolean;
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
  userId: number;
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

interface SendMsgPayload {
  chatId: number;
  message: {
    text: string;
    // image?: File; // To be added later
  };
}

interface ClientToServerEvents {
  markChatAsRead: (id: number) => void;
  sendMessage: (p: SendMsgPayload, ack: (m: Message) => void) => void;
  createChat: (targetId: number, ack: (c: ChatSummary) => void) => void;
}

interface ServerToClientEvents {
  readChat: (id: number) => void;
  newMessage: (m: Message) => void;
  newChat: (c: ChatSummary) => void;
  newNotification: (notif: INotification) => void;
}

/**
 * =============== CHAT ===================
 */

interface Chat {
  id: number;
  member: User[];
  message: Message[];
  _count: {
    message: number;
  };
}

interface Message {
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

type MsgStatus = "UNREAD" | "READ" | "PENDING";

interface ChatSummary {
  id: number;
  lastMessage: Message | null;
  unreadCount: number;
  otherUser: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

interface InfiniteData<T> {
  pages: T[];
  pageParams: unknown[];
}
