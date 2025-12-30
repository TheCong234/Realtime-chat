"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import StatusDot from "../../../components/StatusDot";
import Link from "next/link";
import { ChatCardDropdown } from "./ChatCardDropdown";
import { cn } from "@/lib/utils";

interface IChatCardProps {
  name: string;
  message: string;
  messageId: string;
  avatarUrl?: string;
  isGroup?: boolean;
}

export function ChatCard({
  messageId,
  name,
  message,
  avatarUrl = "/assets/images/no-avatar.png",
  isGroup = false,
}: IChatCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="group/chatcard relative">
      <Link
        className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-2 pr-10"
        href={`/messenger/${messageId}`}
      >
        <div className="relative">
          <Avatar className="h-14 w-14 border border-gray-200">
            <AvatarImage src={avatarUrl} alt={name} />
          </Avatar>
          <span className="absolute right-1 bottom-1">
            <StatusDot />
          </span>
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{name}</span>
          <span className="text-muted-foreground truncate text-sm">{message}</span>
        </div>
      </Link>

      <div
        className={cn(
          "absolute top-1/2 right-2 -translate-y-1/2 transition-opacity duration-200",
          isDropdownOpen ? "opacity-100" : "opacity-0 group-hover/chatcard:opacity-100",
        )}
      >
        <ChatCardDropdown isGroup={isGroup} onOpenChange={setIsDropdownOpen} />
      </div>
    </div>
  );
}
