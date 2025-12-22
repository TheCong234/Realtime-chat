using CoongChat.Domain.Common;

namespace CoongChat.Domain.Entities
{
    public class OtpCode
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string Code { get; set; }
        public OtpType Type { get; set; } // ResetPassword, VerifyEmail

        public DateTime ExpiredAt { get; set; }
        public bool IsUsed { get; set; } = false;
    }

}
