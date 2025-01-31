interface Credentials {
  name?: string;
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
  avatar: null | string;
  role: "GUEST" | "USER" | "ADMIN";
}

interface AuthError {
  message: string;
  errorDetails?: string[];
}

interface IAuthContext {
  user: User | null;
  login: (cred: Credentials) => Promise<void>;
  register: (cred: Credentials) => Promise<void>;
  logout: () => void;
  error: AuthError | null;
  loading: boolean;
}
