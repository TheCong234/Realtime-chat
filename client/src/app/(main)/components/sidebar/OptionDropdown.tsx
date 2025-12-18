import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveIcon,
  LockKeyholeIcon,
  MessageCircleOffIcon,
  MessageCircleQuestionMarkIcon,
  MessageSquareWarningIcon,
  SettingsIcon,
} from "lucide-react";

const DropdownMenuItemCustom = ({ icon, label }: { icon: React.ReactNode; label: string }) => {
  return (
    <DropdownMenuItem className="flex items-center gap-2">
      {icon}
      {label}
    </DropdownMenuItem>
  );
};

export function OptionDropdown() {
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
        <DropdownMenuItemCustom icon={<MessageCircleQuestionMarkIcon />} label="Tin nhắn đang chờ" />
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
