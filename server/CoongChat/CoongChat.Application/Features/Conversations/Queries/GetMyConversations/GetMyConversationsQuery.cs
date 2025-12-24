using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Conversations.Dto;
using MediatR;

namespace CoongChat.Application.Features.Conversations.Queries.GetMyConversations
{
    public class GetMyConversationsQuery : BaseFilter, IRequest<BaseResponse<PagedResult<ConversationDto>>>
    {
        public Guid CurrentUserId { get; set; }
    }
}
