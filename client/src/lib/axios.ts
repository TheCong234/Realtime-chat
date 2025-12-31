import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (!res.success) {
      return Promise.reject({
        message: res.message,
      });
    }
    return res;
  },
  (error) => {
    return Promise.reject({
      message: error.response?.data?.message || error.message || "Đã xảy ra lỗi hệ thống",
    });
  },
);
