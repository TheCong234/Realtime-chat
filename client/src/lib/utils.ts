import { IUser } from "@/features/user/user.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateInput: string | Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(dateInput).getTime()) / 1000);

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
