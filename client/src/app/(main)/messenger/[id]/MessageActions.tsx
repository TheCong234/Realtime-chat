"use client";

import { Button } from "@/components/ui/button";
import { Smile, Forward, EllipsisVertical, Undo2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { recallMessage } from "@/features/messages/message.slice";

interface IMessageActionsProps {
  messageId: string;
  isOwner: boolean;
  isDeleted?: boolean;
}

export function MessageActions({ messageId, isOwner, isDeleted }: IMessageActionsProps) {
  const dispatch = useDispatch();

  const handleRecall = () => {
    dispatch(recallMessage({ messageId }));
  };

  // Don't show actions for recalled messages
  if (isDeleted) return null;

  return (
    <div className="bg-background flex items-center gap-1 rounded-full px-1 shadow">
      {/* Emoji */}
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Smile className="size-4" />
      </Button>

      {/* Forward */}
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Forward className="size-4" />
      </Button>

      {/* More */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>Trả lời</DropdownMenuItem>
          <DropdownMenuItem>Sao chép</DropdownMenuItem>
          {isOwner && (
            <DropdownMenuItem onClick={handleRecall}>
              <Undo2 className="mr-2 size-4" />
              Thu hồi
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
