"use client";

import { cn } from "@/lib/utils";
import { ChatMessageData } from "@/types/chat";
import { MessageContent } from "./MessageContent";
import { MessageActions } from "./MessageActions";

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={cn("group flex gap-2 px-4 py-1", message.isMe ? "justify-end" : "justify-start")}>
      {/* Nội dung tin nhắn */}
      <div className="relative max-w-[70%]">
        <MessageContent message={message} />

        {/* Action buttons – chỉ hiện khi hover */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100",
            message.isMe ? "-left-24" : "-right-24",
          )}
        >
          <MessageActions />
        </div>
      </div>
    </div>
  );
}
