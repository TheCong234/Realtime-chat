import { Avatar, AvatarImage } from "@/components/ui/avatar";
import StatusDot from "./StatusDot";

interface ChatCardProps {
  name: string;
  message: string;
  avatarUrl?: string;
}

export function ChatCard({
  name,
  message,
  avatarUrl = "/assets/images/no-avatar.png",
}: ChatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer">
      <div className="relative">
        <Avatar className="h-14 w-14 border border-gray-200">
          <AvatarImage src={avatarUrl} alt={name} />
        </Avatar>
        <span className="absolute bottom-1 right-1">
          <StatusDot />
        </span>
      </div>

      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">{name}</span>
        <span className="text-sm text-muted-foreground truncate">
          {message}
        </span>
      </div>
    </div>
  );
}
