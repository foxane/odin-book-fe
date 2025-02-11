interface Credentials {
  name?: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: null | string;
  role: "GUEST" | "USER" | "ADMIN";
}

interface IAuthContext {
  user: User | null;
  login: (cred: Credentials) => void;
  register: (cred: Credentials) => void;
  logout: () => void;
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
