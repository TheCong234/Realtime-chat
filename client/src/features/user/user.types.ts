import { Role, UserStatus } from "@/constants/enum";

export interface IUser {
  id: string;
  username: string;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;

  emailConfirmed: boolean;
  phoneConfirmed: boolean;

  createdAt: string; // ISO string
  lastOnlineAt: string | null;

  avatarUrl: string | null;

  status: UserStatus;
  isActive: boolean;

  role: Role;
}
