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
  error: IAuthError | null;
  loading: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface IAuthError {
  message: string;
  errorDetails?: string[];
}
