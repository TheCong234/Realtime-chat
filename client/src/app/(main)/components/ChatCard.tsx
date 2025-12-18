import { Avatar, AvatarImage } from "@/components/ui/avatar";
import StatusDot from "../../../components/StatusDot";
import Link from "next/link";

interface ChatCardProps {
  name: string;
  message: string;
  messageId: string;
  avatarUrl?: string;
}

export function ChatCard({ messageId, name, message, avatarUrl = "/assets/images/no-avatar.png" }: ChatCardProps) {
  return (
    <Link
      className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-2"
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
  );
}
