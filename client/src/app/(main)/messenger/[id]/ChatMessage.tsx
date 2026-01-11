"use client";

import { cn } from "@/lib/utils";
import { MessageContent } from "./MessageContent";
import { MessageActions } from "./MessageActions";
import { MessageStatusIndicator } from "./MessageStatusIndicator";
import { IMessage } from "@/features/messages/message.type";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MessageReadStatus } from "@/constants/enum";

interface IChatMessageProps {
  message: IMessage;
}

export function ChatMessage({ message }: IChatMessageProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isOwnMessage = message.senderId === currentUser?.id;
  const isRecalled = message.isDeleted || message.status === MessageReadStatus.Recalled;

  return (
    <div className={cn("group flex gap-2 px-4", isOwnMessage ? "justify-end" : "justify-start")}>
      <div className="relative max-w-[70%]">
        <div className="flex items-end gap-1">
          <MessageContent message={message} />
          {/* Show status indicator for own messages only */}
          {isOwnMessage && <MessageStatusIndicator status={message.status} />}
        </div>

        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100",
            isOwnMessage ? "-left-28" : "-right-28",
          )}
        >
          <MessageActions messageId={message.id} isOwner={isOwnMessage} isDeleted={isRecalled} />
        </div>
      </div>
    </div>
  );
}
