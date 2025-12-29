export enum UserStatus {
  Offline = 0,
  Online = 1,
  Away = 2,
}

export enum OtpType {
  ResetPassword = 0,
  VerifyEmail = 1,
  VerifyPhone = 2,
}

export enum ConversationType {
  Private = 0,
  Group = 1,
}

export enum ConversationRole {
  Admin = 0,
  Member = 1,
}

export enum MessageType {
  Text = 0,
  Image = 1,
  File = 2,
  Sticker = 3,
}

export enum MessageReadStatus {
  Sent = 0,
  Delivered = 1,
  Seen = 2,
}

export enum NotificationType {
  NewMessage = 0,
  AddedToGroup = 1,
  System = 2,
}

export enum Role {
  User = "User",
  Admin = "Admin",
}
