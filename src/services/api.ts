import axiosBase, { AxiosInstance } from "axios";

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
export default api;
