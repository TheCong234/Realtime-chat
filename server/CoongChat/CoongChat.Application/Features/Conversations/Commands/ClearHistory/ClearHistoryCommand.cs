using CoongChat.Application.Common.Models;
using MediatR;

namespace CoongChat.Application.Features.Conversations.Commands.ClearHistory
{
    public class ClearHistoryCommand : IRequest<BaseResponse<bool>>
    {
        public Guid ConversationId { get; set; }
        public Guid CurrentUserId { get; set; }

        public ClearHistoryCommand(Guid conversationId, Guid currentUserId)
        {
            ConversationId = conversationId;
            CurrentUserId = currentUserId;
        }
    }
}
