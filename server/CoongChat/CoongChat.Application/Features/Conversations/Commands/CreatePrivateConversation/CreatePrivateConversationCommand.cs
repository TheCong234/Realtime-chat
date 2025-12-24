using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Conversations.Dto;
using MediatR;

namespace CoongChat.Application.Features.Conversations.Commands.CreatePrivateConversation
{
    public class CreatePrivateConversationCommand : IRequest<BaseResponse<ConversationDto>>
    {
        public Guid TargetUserId { get; set; }
        public Guid CurrentUserId { get; set; }
    }
}
