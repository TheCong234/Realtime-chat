using CoongChat.Domain.Common;

namespace CoongChat.Application.Features.Messages.Dto
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public Guid SenderId { get; set; }
        public MessageType Type { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        // Can add attachments or status here later if needed
    }
}
