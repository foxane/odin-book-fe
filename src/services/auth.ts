import { AxiosError } from "axios";
import api from "./api";

class AuthError extends Error {
  errorDetails?: string[];

  constructor(message: string, errorDetails?: string[]) {
    super(message);
    this.errorDetails = errorDetails;
  }
}

class AuthService {
  /**
   * No matter the error, it will always throw AuthError
   */
  private errorHandler(err: unknown): never {
    if (err instanceof AxiosError) {
      if (err.response) {
        const data = err.response.data as {
          message: string;
          errorDetails?: string[];
        };
        throw new AuthError(data.message, data.errorDetails);
      } else {
        throw new AuthError(err.message);
      }
    } else {
      console.log(err);
      throw new AuthError("Unexpexted error");
    }
  }

  async getUserInfo() {
    try {
      return (await api.axios.get<User>("/auth/me")).data;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async login(cred: Credentials) {
    try {
      const { data } = await api.axios.post<AuthResponse>("/auth/login", cred);
      api.setToken(data.token);
      return data.user;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async register(cred: Credentials) {
    try {
      const { data } = await api.axios.post<AuthResponse>(
        "/auth/register",
        cred,
      );
      api.setToken(data.token);
      return data.user;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  logout() {
    api.setToken(null);
  }
}

const authService = new AuthService();
export default authService;
