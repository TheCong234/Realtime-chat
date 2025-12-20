using CoongChat.Domain.Common;

namespace CoongChat.Domain.Entities
{
    public class ConversationMember
    {
        public Guid ConversationId { get; set; }
        public Guid UserId { get; set; }

        public ConversationRole Role { get; set; } // Admin / Member
        public DateTime JoinedAt { get; set; }

        public Conversation Conversation { get; set; }
        public User User { get; set; }
    }

}
