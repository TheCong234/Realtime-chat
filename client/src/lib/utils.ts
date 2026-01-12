import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateInput: string | Date): string {
  if (!dateInput) return "";

  const now = new Date();
  let targetDate: Date;

  if (typeof dateInput === "string") {
    // If the date string doesn't include timezone info (no 'Z' or offset),
    // treat it as UTC by appending 'Z'
    if (!dateInput.includes("Z") && !dateInput.includes("+") && !dateInput.includes("-", 10)) {
      targetDate = new Date(dateInput + "Z");
    } else {
      targetDate = new Date(dateInput);
    }
  } else {
    targetDate = dateInput;
  }

  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 0) return "Vừa xong";

  const units = [
    { label: "năm", seconds: 31536000 },
    { label: "tháng", seconds: 2592000 },
    { label: "tuần", seconds: 604800 },
    { label: "ngày", seconds: 86400 },
    { label: "tiếng", seconds: 3600 },
    { label: "phút", seconds: 60 },
    { label: "giây", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label} trước`;
    }
  }

  return "Vừa xong";
}

//user
interface IUserInitials {
  fullName: string | null | undefined;
  username: string;
}
export const getUserInitials = ({ fullName, username }: IUserInitials) => {
  if (fullName) {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return username.slice(0, 2).toUpperCase();
};

//error

export const getErrorMessage = (error: any): string => {
  // 1. Nếu error là object và có field message trực tiếp (do Interceptor reject res)
  if (error?.message && typeof error.message === "string") {
    return error.message;
  }

  // 2. Nếu error là object có field message là một object khác (trường hợp cũ của bạn)
  if (error?.message?.message) {
    return String(error.message.message);
  }

  // 3. Nếu là lỗi của Axios (chưa qua interceptor hoặc lỗi kết nối)
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // 4. Các lỗi mặc định
  if (typeof error === "string") return error;

  return error?.message || "Đã có lỗi xảy ra";
};
