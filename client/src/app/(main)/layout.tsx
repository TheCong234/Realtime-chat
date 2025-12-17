import { AppSidebar } from "@/app/(main)/components/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex h-screen max-h-screen flex-col">
          {/* chat content */}
          <div className="flex-1 overflow-y-scroll bg-[#F0F2F5] p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
