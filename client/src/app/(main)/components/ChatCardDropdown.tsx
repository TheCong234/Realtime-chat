"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveIcon,
  BanIcon,
  EllipsisIcon,
  FlagIcon,
  LogOutIcon,
  MailOpenIcon,
  PhoneIcon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";

interface IChatCardDropdownProps {
  isGroup?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenuItemCustom = ({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <DropdownMenuItem className={`flex items-center gap-2 ${className || ""}`} onClick={onClick}>
      {icon}
      {label}
    </DropdownMenuItem>
  );
};

export function ChatCardDropdown({ isGroup = false, onOpenChange }: IChatCardDropdownProps) {
  const handleMarkAsUnread = () => {
    console.log("Mark as unread");
  };

  const handleArchive = () => {
    console.log("Archive");
  };

  const handleVoiceCall = () => {
    console.log("Voice call");
  };

  const handleVideoCall = () => {
    console.log("Video call");
  };

  const handleDeleteChat = () => {
    console.log("Delete chat");
  };

  const handleReport = () => {
    console.log("Report");
  };

  const handleBlock = () => {
    console.log("Block");
  };

  const handleLeaveGroup = () => {
    console.log("Leave group");
  };

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <EllipsisIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItemCustom
            icon={<MailOpenIcon className="size-4" />}
            label="Đánh dấu là chưa đọc"
            onClick={handleMarkAsUnread}
          />
          <DropdownMenuItemCustom icon={<ArchiveIcon className="size-4" />} label="Lưu trữ" onClick={handleArchive} />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItemCustom
            icon={<PhoneIcon className="size-4" />}
            label="Cuộc gọi thoại"
            onClick={handleVoiceCall}
          />
          <DropdownMenuItemCustom
            icon={<VideoIcon className="size-4" />}
            label="Cuộc gọi video"
            onClick={handleVideoCall}
          />
          <DropdownMenuItemCustom
            icon={<Trash2Icon className="size-4" />}
            label="Xóa đoạn chat"
            onClick={handleDeleteChat}
            className="text-destructive"
          />
          <DropdownMenuItemCustom icon={<FlagIcon className="size-4" />} label="Báo cáo" onClick={handleReport} />
          <DropdownMenuItemCustom icon={<BanIcon className="size-4" />} label="Chặn" onClick={handleBlock} />
          {isGroup && (
            <DropdownMenuItemCustom
              icon={<LogOutIcon className="size-4" />}
              label="Rời nhóm"
              onClick={handleLeaveGroup}
              className="text-destructive"
            />
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
