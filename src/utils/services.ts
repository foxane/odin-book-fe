import axios, { AxiosInstance } from "axios";

class ApiService {
  private url = import.meta.env.VITE_API_URL;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.url,
    });
  }

  setToken(token: string | null) {
    if (token) {
      this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common.Authorization;
    }
  }

  get axios() {
    return this.axiosInstance;
  }
}
export const api = new ApiService();
