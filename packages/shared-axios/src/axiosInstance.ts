import axios from "axios";

export function createAxiosInstance() {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
  });
}

const axiosInstance = createAxiosInstance();

export default axiosInstance;
