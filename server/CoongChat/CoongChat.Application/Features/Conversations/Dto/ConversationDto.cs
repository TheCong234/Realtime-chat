using CoongChat.Domain.Common;

namespace CoongChat.Application.Features.Conversations.Dto
{
    public class ConversationDto
    {
        public Guid Id { get; set; }
        public ConversationType Type { get; set; }
        public string? Name { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<ConversationMemberDto> Members { get; set; }
    }

    public class ConversationMemberDto
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string AvatarUrl { get; set; }
        public ConversationRole Role { get; set; }
    }
}
