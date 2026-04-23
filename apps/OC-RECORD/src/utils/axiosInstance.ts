// utils/axiosInstance.ts
import { AxiosHeaders } from "axios";
import { createAxiosInstance } from "@ocean-kit/shared-axios/axiosInstance";

const axiosInstance = createAxiosInstance();

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
