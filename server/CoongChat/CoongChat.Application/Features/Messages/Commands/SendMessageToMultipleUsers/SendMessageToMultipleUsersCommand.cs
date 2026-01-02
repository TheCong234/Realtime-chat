using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Messages.Dto;
using CoongChat.Domain.Common;
using MediatR;

namespace CoongChat.Application.Features.Messages.Commands.SendMessageToMultipleUsers
{
    public class SendMessageToMultipleUsersCommand : IRequest<BaseResponse<MessageDto>>
    {
        public List<Guid> UserIds { get; set; } = new List<Guid>();
        public Guid CurrentUserId { get; set; }
        public MessageType Type { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
