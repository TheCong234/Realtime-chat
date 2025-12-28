export interface Member {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: number;
}

export interface Conversation {
  id: string;
  type: number;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  members: Member[];
}

export interface ConversationState {
  conversations: Conversation[];
  loading: boolean;
}
