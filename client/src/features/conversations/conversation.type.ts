import { UserStatus } from "@/constants/enum";

export interface IMember {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: number;
  status: UserStatus;
}

export interface IConversation {
  id: string;
  type: number;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  members: IMember[];
}

export interface IConversationState {
  conversations: IConversation[];
  conversation: IConversation | null;
  loading: boolean;
}
