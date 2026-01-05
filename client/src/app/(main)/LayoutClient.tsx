"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMeRequest } from "@/features/user/user.slice";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AuthGuard from "@/components/AuthGuard";
import { AppSidebar } from "./components/sidebar";
import { useSignalR } from "@/hooks/useSignalR";
import { Separator } from "@/components/ui/separator";

export default function LayoutClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useDispatch();

  // Initialize SignalR connection
  useSignalR();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(getMeRequest(token));
    }
  }, [dispatch]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen max-h-screen flex-col">
        {/* Mobile header with menu toggle - only visible on mobile */}
        <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-semibold">Tin nhắn</span>
        </header>

        {/* Main chat content - responsive padding */}
        <div className="bg-muted dark:bg-background/50 flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
          <AuthGuard>{children}</AuthGuard>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
