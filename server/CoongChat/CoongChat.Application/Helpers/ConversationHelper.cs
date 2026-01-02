using CoongChat.Application.Features.Messages.Commands.SendMessageToMultipleUsers;
using CoongChat.Domain.Common;
using CoongChat.Domain.Entities;

namespace CoongChat.Application.Helpers
{
    public class ConversationHelper
    {
        public static Conversation CreateNewPrivateConversation(SendMessageWithoutConversationCommand request)
        {
            return new Conversation
            {
                Id = Guid.NewGuid(),
                Type = ConversationType.Private,
                CreatedAt = DateTime.UtcNow,
                Members = new List<ConversationMember>
                {
                    new ()
                    {
                        UserId = request.CurrentUserId,
                        Role = ConversationRole.Member,
                        JoinedAt = DateTime.UtcNow
                    },
                    new ()
                    {
                        UserId = request.TargetUserId,
                        Role = ConversationRole.Member,
                        JoinedAt = DateTime.UtcNow
                    }
                }
            };
        }

    }
}
