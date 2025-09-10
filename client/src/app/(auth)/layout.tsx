import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth - Realtime Chat App",
  description: "Đăng nhập hoặc đăng ký để sử dụng ứng dụng chat thời gian thực",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
