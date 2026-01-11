using CoongChat.Application.Common.Models;
using MediatR;

namespace CoongChat.Application.Features.Messages.Commands.RecallMessage
{
    public class RecallMessageCommand : IRequest<BaseResponse<bool>>
    {
        public Guid MessageId { get; set; }
        public Guid CurrentUserId { get; set; }
    }
}
