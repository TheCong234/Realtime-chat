import { cn } from "@/lib/utils";
import { IMessage } from "@/features/messages/message.type";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MessageType } from "@/constants/enum";
import Image from "next/image";

interface IProps {
  message: IMessage;
}

export function MessageContent({ message }: IProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const baseClass = cn(
    "rounded-2xl px-4 py-2 text-sm break-words",
    message.senderId === currentUser?.id
      ? "bg-blue-500 text-white rounded-br-md"
      : "bg-muted text-foreground rounded-bl-md",
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
