using CoongChat.Domain.Common;

namespace CoongChat.Domain.Entities
{
    public class MessageStatus
    {
        public Guid MessageId { get; set; }
        public Guid UserId { get; set; }

        public MessageReadStatus Status { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Message Message { get; set; }
        public User User { get; set; }
    }
}

