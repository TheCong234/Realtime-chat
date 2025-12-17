import { cn } from "@/lib/utils";
import { ChatMessageData } from "@/types/chat";

interface Props {
  message: ChatMessageData;
}

export function MessageContent({ message }: Props) {
  const baseClass = cn(
    "rounded-2xl px-4 py-2 text-sm break-words",
    message.isMe ? "bg-blue-500 text-white rounded-br-md" : "bg-muted text-foreground rounded-bl-md",
  );

  if (message.type === "image") {
    return <img src={message.content} alt="image" className="max-w-xs rounded-xl object-cover" />;
  }

  if (message.type === "sticker") {
    return <img src={message.content} alt="sticker" className="h-28 w-28 object-contain" />;
  }

  // text
  return <div className={baseClass}>{message.content}</div>;
}
