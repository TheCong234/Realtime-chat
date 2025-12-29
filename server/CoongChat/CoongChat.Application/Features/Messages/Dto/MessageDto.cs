using CoongChat.Domain.Common;
using CoongChat.Application.Features.Users.DTOs;

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
        public UserDto? Sender { get; set; }
        // Can add attachments or status here later if needed
    }
}
