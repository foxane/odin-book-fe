/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axiosBase, { AxiosInstance, AxiosError } from "axios";
import { removePTag } from "./helper";

/**
 * Class to setup axios config
 */
class ApiService {
  axios: AxiosInstance;
  constructor(baseURL: string) {
    this.axios = axiosBase.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    const token = localStorage.getItem("token");
    if (token) {
      this.setToken(token);
    }
  }

  setToken(token: string | null) {
    if (token) {
      this.axios.defaults.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete this.axios.defaults.headers.Authorization;
      localStorage.removeItem("token");
    }
  }
}

const api = new ApiService(import.meta.env.VITE_API_URL);

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
        throw new AuthError("Server seems to be offline", [
          "Sorry, I can't keep the service up :(",
          "If you want to try the website,",
          "create issue in the repo.",
          "I'll try to gather any coins i could find",
          "The link is in the footer.",
        ]);
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

export const authService = new AuthService();

export const postService = {
  getMany: async (cursor?: string) => {
    const { data } = await api.axios.get<Post[]>(
      `/posts?cursor=${cursor ?? ""}`,
    );
    return data;
  },

  create: async (p: PostPayload) => {
    const { data } = await api.axios.post<Post>("/posts", p);
    return data;
  },

  like: async (p: Post) => {
    const endpoint = `/posts/${p.id.toString()}/like`;

    if (p.isLiked) await api.axios.delete(endpoint);
    else await api.axios.post(endpoint);
  },

  update: async (payload: Post) => {
    const { data } = await api.axios.put<Post>(
      `/posts/${payload.id.toString()}`,
      { text: removePTag(payload.text) },
    );
    return data;
  },

  delete: async (post: Post) => {
    await api.axios.delete(`/posts/${post.id.toString()}`);
  },
};
