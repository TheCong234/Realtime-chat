"use client";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/features/auth/auth.slice";
import {
  ArchiveIcon,
  LockKeyholeIcon,
  LogOutIcon,
  MessageCircleOffIcon,
  MessageSquareWarningIcon,
  SettingsIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useState } from "react";
import { UpdateProfileDialog } from "./UpdateProfileDialog";

const DropdownMenuItemCustom = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <DropdownMenuItem className="flex items-center gap-2" onClick={onClick}>
      {icon}
      {label}
    </DropdownMenuItem>
  );
};

export function OptionDropdown() {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công");
    router.replace("/login");
  };
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      <UpdateProfileDialog open={openProfile} onOpenChange={setOpenProfile} />
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem onClick={() => setOpenProfile(true)}>
                <span>Hồ sơ cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Tài khoản</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Giao diện (Sáng/Tối)</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItemCustom icon={<MessageSquareWarningIcon />} label="Tin nhắn đang chờ" />
          <DropdownMenuItemCustom icon={<ArchiveIcon />} label="Tin nhắn đã lưu" />
          <DropdownMenuItemCustom icon={<MessageCircleOffIcon />} label="Tài khoản hạn chế" />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItemCustom icon={<LockKeyholeIcon />} label="Quyền riêng tư và an toàn" />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItemCustom icon={<LogOutIcon />} label="Đăng xuất" onClick={handleLogout} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </>
  );
}
