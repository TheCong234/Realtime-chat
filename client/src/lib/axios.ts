import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res && res.success === false) {
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    const serverError = error.response?.data;
    return Promise.reject(serverError || error || "Đã xảy ra lỗi hệ thống");
  },
);
