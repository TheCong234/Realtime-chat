using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Messages.Dto;
using MediatR;

namespace CoongChat.Application.Features.Messages.Queries
{
    public class GetMessagesByConversationIdQuery : BaseFilter, IRequest<BaseResponse<PagedResult<MessageDto>>>
    {
        public Guid ConversationId { get; set; }
        public Guid CurrentUserId { get; set; }

        public GetMessagesByConversationIdQuery(Guid conversationId, Guid currentUserId)
        {
            ConversationId = conversationId;
            CurrentUserId = currentUserId;
        }
    }
}
