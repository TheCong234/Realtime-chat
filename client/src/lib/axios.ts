import axios from "axios";
import { BaseResponse } from "@/types/api-response";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  (response) => {
    const res = response.data as BaseResponse<any>;

    if (!res.success) {
      return Promise.reject({
        message: res.message,
      });
    }
    return res.data;
  },
  (error) => {
    return Promise.reject({
      message: error.response?.data?.message || error.message || "Đã xảy ra lỗi hệ thống",
    });
  },
);
