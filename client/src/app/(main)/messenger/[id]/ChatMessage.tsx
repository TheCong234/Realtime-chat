"use client";

import { cn } from "@/lib/utils";
import { MessageContent } from "./MessageContent";
import { MessageActions } from "./MessageActions";
import { IMessage } from "@/features/messages/message.type";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface IChatMessageProps {
  message: IMessage;
  // isGroup?: boolean;
}

export function ChatMessage({ message }: IChatMessageProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isOwnMessage = message.senderId === currentUser?.id;

  return (
    <div className={cn("group flex gap-2 px-4", isOwnMessage ? "justify-end" : "justify-start")}>
      <div className="relative max-w-[70%]">
        <MessageContent message={message} />

        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100",
            isOwnMessage ? "-left-28" : "-right-28",
          )}
        >
          <MessageActions />
        </div>
      </div>
    </div>
  );
}
