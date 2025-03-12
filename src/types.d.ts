type Role = "ADMIN" | "USER" | "GUEST";

type MsgStatus = "UNREAD" | "READ" | "PENDING";

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
  avatar: string | null;
  background: string | null;
  bio: string | null;
  createdAt: string;
  provider: OAuth | null;
  role: Role;
  lastSeen: string | null;
  isFollowed: boolean;
  _count: {
    follower: number;
    following: number;
  };
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
  createdAt: string | Date;
  updatedAt: string | null;
  user: Pick<User, "id" | "name" | "avatar" | "lastSeen">;
  userId: number;
  _count: {
    likedBy: number;
    comment: number;
  };
  isLiked: boolean;
  status?: "create" | "update" | "delete"; // frontend only
}

interface InfiniteData<T> {
  pageParams: unknown[];
  pages: T[];
}

type InfinitePost = InfiniteData<Post[]>;
type InfiniteComment = InfiniteData<IComment[]>;

interface IComment {
  id: number;
  text: string;
  media: string[];
  createdAt: Date | string;
  updatedAt: string | null;
  postId: number;
  userId: number;
  user: Pick<User, "id" | "name" | "avatar" | "lastSeen">;
  _count: {
    likedBy: number;
    comment: number;
  };
  isLiked: boolean;
  status?: "create" | "update" | "delete"; // frontend only
}

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
  comment?: IComment | null;
  commentId?: number | null;
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

/**
 * Summary of chat room model
 */
interface ChatSummary {
  id: number;
  lastMessage: Message | null;
  /**
   * Unread count for received message. Derived on the server
   */
  unreadCount: number;
  /**
   * Chat model are one-to-one. Other user is simply not the current user
   */
  otherUser: {
    id: number;
    name: string;
    avatar: string | null;
    lastSeen: string | null;
  };

  isDummy: boolean; // FE only
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
