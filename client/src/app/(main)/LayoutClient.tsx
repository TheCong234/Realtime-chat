"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { clearAuthError, getMeRequest } from "@/features/auth/auth.slice";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import AuthGuard from "@/components/AuthGuard";
import { AppSidebar } from "./components/sidebar";
import { RootState } from "@/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LayoutClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { getMeStatus, error } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(getMeRequest(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (getMeStatus === "error") {
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
      toast.error("Lỗi khi lấy thông tin người dùng, vui lòng đăng nhập lại", { description: error });
      dispatch(clearAuthError());
      router.replace("/login");
    }
  }, [getMeStatus]);
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
