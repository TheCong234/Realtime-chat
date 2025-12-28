using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Messages.Dto;
using MediatR;

namespace CoongChat.Application.Features.Messages.Queries
{
    public class GetMessagesByConversationIdQuery : BaseFilter, IRequest<BaseResponse<PagedResult<MessageDto>>>
    {
        public Guid ConversationId { get; set; }
    }
}
