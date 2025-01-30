interface Credentials {
  email: string;
  password: string;
}

interface RegCredentials extends Credentials {
  name: string;
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
  register: (cred: RegCredentials) => Promise<void>;
  logout: () => void;
  error: AuthError | null;
}
