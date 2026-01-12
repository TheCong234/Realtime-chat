using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Messages.Dto;
using CoongChat.Domain.Common;
using MediatR;

namespace CoongChat.Application.Features.Messages.Commands.SendMessage
{
    public class SendMessageCommand : IRequest<BaseResponse<MessageDto>>
    {
        public Guid? Id { get; set; }  // Optional: client can provide ID for optimistic updates
        public Guid ConversationId { get; set; }
        public Guid CurrentUserId { get; set; }
        public MessageType Type { get; set; }
        public string Content { get; set; }
    }
}

