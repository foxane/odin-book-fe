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

interface SendMsgPayload {
  targetId: number;
  chatId: number;
  message: {
    text: string;
    // image?: File; // To be added later
  };
}

interface NewMsgPayload {
  chatId: number;
  message: Message;
}

interface ClientToServerEvents {
  readChat: (id: number) => void;
  sendMessage: (p: SendMsgPayload) => void;
  createChat: (targetId: number) => void;
}

interface ServerToClientEvents {
  chatCreated: (c: chat) => void; // Response to the one who create the chat room
  newMessage: (e: NewMsgPayload) => void;
  newChat: (c: Chat) => void; // Response to member
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

type MsgStatus = "UNREAD" | "READ";

/**
 * ====================== Outlet context ===================
 */

interface NoticationOutlet {
  notification: INotification[];
  unreadCount: number;
  read: (id: number) => void;
  readAll: () => void;
  /**
   * @param unread True = delete unread notif aswell
   */
  clear: (unread?: boolean) => void;
}

interface MessageOutlet {
  chats: Chat[];
  sendMessage: (opts: SendMsgPayload) => void;
  unreadChat: number;
}

interface OutletContext {
  notifOutlet: NoticationOutlet;
  msgOutlet: MessageOutlet;
}
