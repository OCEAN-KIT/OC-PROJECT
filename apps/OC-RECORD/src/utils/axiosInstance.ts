// utils/axiosInstance.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const isInternalApi =
    typeof config.url === "string" &&
    (config.url.startsWith("/api/admin") || config.url.startsWith("/api/user"));

  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  if (isInternalApi && typeof window !== "undefined") {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  config.headers = headers;
  return config;
});

export default axiosInstance;
