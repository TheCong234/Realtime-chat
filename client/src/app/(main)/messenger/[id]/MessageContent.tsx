import { cn } from "@/lib/utils";
import { IMessage } from "@/features/messages/message.type";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MessageType, MessageReadStatus } from "@/constants/enum";
import Image from "next/image";

interface IProps {
  message: IMessage;
}

export function MessageContent({ message }: IProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isOwner = message.senderId === currentUser?.id;
  const isRecalled = message.isDeleted || message.status === MessageReadStatus.Recalled;

  // Recalled message style
  if (isRecalled) {
    return (
      <div
        className={cn(
          "text-muted-foreground rounded-2xl px-4 py-2 text-sm italic",
          isOwner ? "rounded-br-md bg-blue-500/20" : "bg-muted/50 rounded-bl-md",
        )}
      >
        Tin nhắn đã được thu hồi
      </div>
    );
  }

  const baseClass = cn(
    "rounded-2xl px-4 py-2 text-sm break-words",
    isOwner ? "bg-blue-500 text-white rounded-br-md" : "bg-muted text-foreground rounded-bl-md",
  );

  if (message.type === MessageType.Image) {
    return (
      <Image
        src={message.content}
        alt="image"
        width={0}
        height={0}
        sizes="100vw"
        className="h-auto w-auto max-w-xs rounded-xl object-cover"
      />
    );
  }

  if (message.type === MessageType.Sticker) {
    return (
      <Image
        src={message.content}
        alt="sticker"
        width={0}
        height={0}
        sizes="100vw"
        className="h-28 w-28 object-contain"
      />
    );
  }

  // text
  return <div className={baseClass}>{message.content}</div>;
}
