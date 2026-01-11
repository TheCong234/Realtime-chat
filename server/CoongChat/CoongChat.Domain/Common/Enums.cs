namespace CoongChat.Domain.Common
{
    public enum UserStatus
    {
        Offline,
        Online,
        Away
    }

    public enum OtpType
    {
        ResetPassword,
        VerifyEmail,
        VerifyPhone
    }

    public enum ConversationType
    {
        Private,
        Group
    }

    public enum ConversationRole
    {
        Admin,
        Member
    }

    public enum MessageType
    {
        Text,
        Image,
        File
    }

    public enum MessageReadStatus
    {
        Sent,
        Delivered,
        Seen,
        Recalled
    }

    public enum NotificationType
    {
        NewMessage,
        AddedToGroup,
        System
    }


}
