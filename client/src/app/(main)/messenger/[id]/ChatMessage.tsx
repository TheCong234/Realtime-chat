"use client";

import { cn } from "@/lib/utils";
import { MessageContent } from "./MessageContent";
import { MessageActions } from "./MessageActions";
import { Message } from "@/features/messages/message.type";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  return (
    <div
      className={cn(
        "group flex gap-2 px-4 py-1",
        message.senderId === currentUser?.id ? "justify-end" : "justify-start",
      )}
    >
      {/* Nội dung tin nhắn */}
      <div className="relative max-w-[70%]">
        <MessageContent message={message} />

        {/* Action buttons – chỉ hiện khi hover */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100",
            message.senderId === currentUser?.id ? "-left-24" : "-right-24",
          )}
        >
          <MessageActions />
        </div>
      </div>
    </div>
  );
}
