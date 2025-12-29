export interface IChatMessageData {
  id: string;
  senderId: string;
  senderName?: string;
  isMe: boolean;
  type: MessageType;
  content: string;
  createdAt?: string;
}

export type MessageType = "text" | "image" | "sticker";
