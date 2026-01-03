using AutoMapper;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Conversations.Dto;
using CoongChat.Application.Features.Messages.Dto;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using MediatR;

namespace CoongChat.Application.Features.Messages.Commands.SendMessage
{
    public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, BaseResponse<MessageDto>>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IConversationRepository _conversationRepository;
        private readonly IChatNotificationService _chatNotificationService;
        private readonly IMapper _mapper;

        public SendMessageCommandHandler(
            IMessageRepository messageRepository,
            IConversationRepository conversationRepository,
            IChatNotificationService chatNotificationService,
            IMapper mapper)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _chatNotificationService = chatNotificationService;
            _mapper = mapper;
        }

        public async Task<BaseResponse<MessageDto>> Handle(
     SendMessageCommand request,
     CancellationToken cancellationToken)
        {

            var conversation = await _conversationRepository
                .GetByConversationByIdAsync(request.ConversationId, cancellationToken);

            if (conversation == null)
            {
                throw new Exception("Cuộc hội thoại không tồn tại.");

            }
            else if (!conversation.Members.Any(m => m.UserId == request.CurrentUserId))
            {
                throw new Exception("Bạn không ở trong cuộc hội thoại này.");
            }

            var message = new Message
            {
                Id = Guid.NewGuid(),
                ConversationId = conversation.Id,
                SenderId = request.CurrentUserId,
                Type = request.Type,
                Content = request.Content,
                CreatedAt = DateTime.UtcNow
            };

            await _messageRepository.AddAsync(message, cancellationToken);

            conversation.LastMessageId = message.Id;
            await _conversationRepository.UpdateAsync(conversation, cancellationToken);

            var messageDto = _mapper.Map<MessageDto>(message);

            // Get all member userIds and broadcast message to them via SignalR
            var memberUserIds = conversation.Members.Select(m => m.UserId).ToList();

            await _chatNotificationService.SendMessageToUsersAsync(
                memberUserIds,
                _mapper.Map<ConversationDto>(conversation),
                messageDto,
                cancellationToken);

            return BaseResponse<MessageDto>.Ok(messageDto, "Tin nhắn đã được gửi");
        }

    }
}
