import { Button } from "@/components/ui/button";
import { Smile, Forward, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MessageActions() {
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
          <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
