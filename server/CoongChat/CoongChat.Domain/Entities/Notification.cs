using CoongChat.Domain.Common;

namespace CoongChat.Domain.Entities
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public NotificationType Type { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
