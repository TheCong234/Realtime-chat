import { MessageType, MessageReadStatus } from "@/constants/enum";

export interface IMessageSender {
  id: string;
  username: string;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  emailConfirmed: boolean;
  phoneConfirmed: boolean;
  createdAt: string;
  lastOnlineAt: string | null;
  avatarUrl: string | null;
  status: number;
  isActive: boolean;
  role: string;
}

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  createdAt: string;
  sender: IMessageSender;
  status?: MessageReadStatus; // Optional: message delivery/read status
}

export interface ISendMessagePayload {
  conversationId: string;
  type: number;
  content: string;
}

export interface IBroadcastMessagePayload {
  userIds: string[];
  type: number;
  content: string;
}
