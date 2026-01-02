import { UserStatus } from "@/constants/enum";
import { IMessage } from "../messages/message.type";

export interface IMember {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: number;
  userStatus: UserStatus;
}

export interface IConversation {
  id: string;
  type: number;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  members: IMember[];
  lastMessage: IMessage | null;
}

export interface IConversationState {
  conversations: IConversation[];
  conversation: IConversation | null;
  loading: boolean;
  searchQuery: string;
}
