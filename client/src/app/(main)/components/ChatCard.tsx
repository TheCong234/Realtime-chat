"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusDot from "../../../components/StatusDot";
import Link from "next/link";
import { ChatCardDropdown } from "./ChatCardDropdown";
import { cn, getUserInitials, timeAgo } from "@/lib/utils";
import { IMessage } from "@/features/messages/message.type";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { IUser } from "@/features/user/user.types";
import { UserStatus } from "@/constants/enum";

interface IChatCardProps {
  name: string;
  lastMessage: IMessage | null;
  conversationId: string;
  avatarUrl?: string;
  isGroup?: boolean;
  userStatus: UserStatus | UserStatus.Offline;
}

export function ChatCard({
  conversationId,
  name,
  lastMessage,
  avatarUrl,
  isGroup = false,
  userStatus,
}: IChatCardProps) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const isActive = pathname === `/messenger/${conversationId}`;

  return (
    <div className="group/chatcard relative">
      <Link
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg p-1 transition-colors",
          "hover:bg-accent",
          isActive && "bg-accent border-primary border-l-4",
        )}
        href={`/messenger/${conversationId}`}
      >
        <div className="relative">
          <Avatar className="h-14 w-14 border border-gray-200">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{getUserInitials({ fullName: "", username: name })}</AvatarFallback>
          </Avatar>
          <span className="absolute right-0 bottom-0">
            <StatusDot className="size-3" status={userStatus} showPulse={false} />
          </span>
        </div>

        <div className="w-full">
          <p className={cn("truncate font-medium", isActive && "font-semibold")}>{name}</p>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground truncate text-xs">
              {lastMessage?.senderId === currentUser?.id
                ? "Bạn: "
                : lastMessage?.sender?.fullName || lastMessage?.sender?.username}
              {lastMessage?.content}
            </span>
            <span className="text-muted-foreground truncate text-xs">{timeAgo(lastMessage?.createdAt || "")}</span>
          </div>
        </div>
      </Link>

      <div
        className={cn(
          "absolute top-1/2 right-2 -translate-y-1/2 transition-opacity duration-200",
          isDropdownOpen ? "opacity-100" : "opacity-0 group-hover/chatcard:opacity-100",
        )}
      >
        <ChatCardDropdown isGroup={isGroup} onOpenChange={setIsDropdownOpen} conversationId={conversationId} />
      </div>
    </div>
  );
}
