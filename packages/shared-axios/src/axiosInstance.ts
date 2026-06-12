import axios from "axios";

export function createAxiosInstance() {
  return axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
  });
}

const axiosInstance = createAxiosInstance();

export default axiosInstance;
