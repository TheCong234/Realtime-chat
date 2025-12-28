import { MessageType } from "@/constants/enum";

export interface MessageSender {
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

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  createdAt: string;
  sender: MessageSender;
}

export interface SendMessagePayload {
  conversationId: string;
  type: number;
  content: string;
}
