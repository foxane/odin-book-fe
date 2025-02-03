import api from "./api";

class PostService {
  async getAllPost() {
    const { data } = await api.axios.get<Post[]>("/posts");
    return data;
  }

  async createPost(payload: PostPayload) {
    const { data } = await api.axios.post<Post>("/posts", payload);
    return data;
  }
}

const postService = new PostService();
export default postService;
