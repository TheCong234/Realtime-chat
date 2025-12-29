using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Conversations.Dto;
using MediatR;

namespace CoongChat.Application.Features.Conversations.Queries.GetConversationDetails
{
    public class GetConversationDetailsQuery : IRequest<BaseResponse<ConversationDto>>
    {
        public Guid ConversationId { get; set; }
        public Guid CurrentUserId { get; set; }
    }
}
