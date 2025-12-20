import type { Metadata } from "next";
import LayoutClient from "./LayoutClient";

export const metadata: Metadata = {
  title: "CoongChat App",
  description: "Ứng dụng chat thời gian thực",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutClient>{children}</LayoutClient>;
}
