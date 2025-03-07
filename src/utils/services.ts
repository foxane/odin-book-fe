import axiosBase, { AxiosInstance, AxiosError } from "axios";
import { removePTag } from "./helper";

/**
 * Class to setup axios config
 */
class ApiService {
  axios: AxiosInstance;
  constructor(baseURL: string) {
    this.axios = axiosBase.create({ baseURL });

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

export const api = new ApiService(import.meta.env.VITE_API_URL);

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
  errorHandler(err: unknown): never {
    if (err instanceof AxiosError) {
      if (err.response) {
        const data = err.response.data as {
          message: string;
          errorDetails?: string[];
        };
        throw new AuthError(data.message, data.errorDetails);
      } else {
        throw new AuthError("Server seems to be offline");
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

  async guestLogin() {
    try {
      const { data } = await api.axios.get<AuthResponse>("/auth/guest");
      api.setToken(data.token);
      return data.user;
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

  async updateUser(payload: UserUpdatePayload, userId: string) {
    try {
      const { data } = await api.axios.put<User>(`/users/${userId}`, payload);
      return data;
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
  getOne: async (id: string) => {
    const { data } = await api.axios.get<Post>(`/post/${id}`);
    return data;
  },

  getMany: async (cursor?: string, search?: string) => {
    const { data } = await api.axios.get<Post[]>(
      `/posts?cursor=${cursor ?? ""}&search=${search ?? ""}`,
    );
    return data;
  },

  getByUser: async (id: string, cursor?: string) => {
    const { data } = await api.axios.get<Post[]>(
      `/users/${id}/posts?cursor=${cursor ?? ""}`,
    );
    return data;
  },

  create: async (p: FormData) => {
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

const base = (i: IComment | Post) => {
  let postId: number;
  if ("postId" in i) postId = i.postId;
  else postId = i.id;

  return `/posts/${postId.toString()}/comments`;
};
export const commentService = {
  getMany: async (postId: string, cursor: string) => {
    const { data } = await api.axios.get<IComment[]>(
      `/posts/${postId}/comments?cursor=${cursor}`,
    );
    return data;
  },

  create: async (payload: CommentPayload, post: Post) => {
    const { data } = await api.axios.post<IComment>(base(post), payload);
    return data;
  },

  update: async (updated: IComment) => {
    const { data } = await api.axios.put<IComment>(
      `${base(updated)}/${updated.id.toString()}`,
      {
        text: updated.text,
      },
    );
    return data;
  },

  delete: async (c: IComment) => {
    await api.axios.delete(`${base(c)}/${c.id.toString()}`);
  },

  like: async (c: IComment) => {
    const endpoint = `${base(c)}/${c.id.toString()}/like`;

    if (c.isLiked) await api.axios.delete(endpoint);
    else await api.axios.post(endpoint);
  },
};

export const userService = {
  getMany: async (cursor?: string, search?: string) => {
    const { data } = await api.axios.get<User[]>(
      `/users?cursor=${cursor ?? ""}&search=${search ?? ""}`,
    );
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.axios.get<User>(`/users/${id}`);
    return data;
  },

  follow: async (u: User) => {
    const uri = `/user/${u.id}/follow`;

    if (u.isFollowed) await api.axios.delete(uri);
    else await api.axios.post(uri);
  },
};

export const notifService = {
  getMany: async (cursor = "", take = "") => {
    const { data } = await api.axios.get<{
      notifications: INotification[];
      unreadCount: number;
    }>(`/notifications?cursor=${cursor}&take=${take}`);
    return data;
  },

  read: async (id: number) => {
    await api.axios.patch(`/notifications/${id.toString()}/read`);
  },

  readAll: async () => {
    await api.axios.patch("/notifications/read-all");
  },

  clear: async (unread?: boolean) => {
    await api.axios.delete(`/notifications?${unread ? "unread=true" : ""}`);
  },
};

export const chatServices = {
  getMany: async (chatId: number) => {
    const { data } = await api.axios.get<Message[]>(`/chat/${chatId}/messages`);
    return data;
  },
};
