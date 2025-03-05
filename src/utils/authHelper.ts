import { AxiosError } from "axios";

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  errorDetails?: string[];
}

export const authErrorHandler = (err: unknown): AuthError => {
  if (err instanceof AxiosError) {
    if (err.response) {
      const data = err.response.data as {
        message: string;
        errorDetails?: string[];
      };
      return data;
    } else {
      return { message: "Server seems to be offline" };
    }
  } else {
    console.log(err);
    return { message: "Unexpected error occured" };
  }
};
