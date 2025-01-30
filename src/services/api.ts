import axiosBase, { AxiosInstance } from "axios";

class ApiService {
  axios: AxiosInstance;
  constructor(baseURL: string) {
    this.axios = axiosBase.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });
  }

  setToken(token: string) {
    this.axios.defaults.headers.Authorization = token;
  }
}

const api = new ApiService(import.meta.env.VITE_API_URL);
export default api;
