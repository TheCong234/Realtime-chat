"use client";

import { MessageReadStatus } from "@/constants/enum";
import { Check, CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IMessageStatusIndicatorProps {
  status?: MessageReadStatus;
  className?: string;
}

export function MessageStatusIndicator({ status, className }: IMessageStatusIndicatorProps) {
  if (status === undefined) return null;

  // Don't show indicator for recalled messages
  if (status === MessageReadStatus.Recalled) return null;

  return (
    <span className={cn("ml-1 inline-flex items-center", className)}>
      {status === MessageReadStatus.Sending && <Loader2 className="text-muted-foreground h-3 w-3 animate-spin" />}
      {status === MessageReadStatus.Sent && <Check className="text-muted-foreground h-3 w-3" />}
      {status === MessageReadStatus.Delivered && <CheckCheck className="text-muted-foreground h-3 w-3" />}
      {status === MessageReadStatus.Seen && <CheckCheck className="h-3 w-3 text-blue-500" />}
    </span>
  );
}
