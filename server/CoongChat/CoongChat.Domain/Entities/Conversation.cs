using CoongChat.Domain.Common;

namespace CoongChat.Domain.Entities
{
    public class Conversation
    {
        public Guid Id { get; set; }

        public ConversationType Type { get; set; } // Private / Group
        public string? Name { get; set; } // Chỉ dùng cho Group
        public string? AvatarUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<ConversationMember> Members { get; set; }
        public ICollection<Message> Messages { get; set; }
    }

}
