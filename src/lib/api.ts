import axios from "axios";

const isServer = typeof window === "undefined";

export const API_BASE_URL = isServer
  ? (process.env.NEXT_PUBLIC_API_URL || "https://api.hostfa.st")
  : "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to format errors nicely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail?.error ||
      error.response?.data?.detail ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);
