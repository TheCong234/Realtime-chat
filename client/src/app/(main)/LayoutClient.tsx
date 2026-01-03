"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMeRequest } from "@/features/user/user.slice";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import AuthGuard from "@/components/AuthGuard";
import { AppSidebar } from "./components/sidebar";
import { useSignalR } from "@/hooks/useSignalR";

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
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex h-screen max-h-screen flex-col">
          {/* chat content */}
          <div className="flex-1 overflow-y-scroll bg-[#F0F2F5] p-4">
            <AuthGuard>{children}</AuthGuard>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
