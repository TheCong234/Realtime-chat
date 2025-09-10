import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Realtime Chat App",
  description: "Ứng dụng chat thời gian thực",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      Main layout
      {children}
    </div>
  );
}
