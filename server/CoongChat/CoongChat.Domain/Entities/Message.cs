using CoongChat.Domain.Common;

namespace CoongChat.Domain.Entities
{
    public class Message
    {
        public Guid Id { get; set; }

        public Guid ConversationId { get; set; }
        public Guid SenderId { get; set; }

        public MessageType Type { get; set; } // Text, Image, File
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }
        public bool IsDeleted { get; set; }

        public Conversation Conversation { get; set; }
        public User Sender { get; set; }

        public ICollection<MessageStatus> Statuses { get; set; }
        public ICollection<MessageAttachment> Attachments { get; set; }
    }

}
