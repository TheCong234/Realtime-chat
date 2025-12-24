"use client";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
    router.replace("/login");
  };
  return (
    <DropdownMenuContent className="w-56" align="start">
      <DropdownMenuGroup>
        <DropdownMenuItemCustom icon={<SettingsIcon />} label="Cài đặt" />
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
  );
}
