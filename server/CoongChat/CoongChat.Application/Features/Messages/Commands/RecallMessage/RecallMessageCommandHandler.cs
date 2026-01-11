using CoongChat.Application.Common.Models;
using CoongChat.Application.Interfaces;
using MediatR;

namespace CoongChat.Application.Features.Messages.Commands.RecallMessage
{
    public class RecallMessageCommandHandler : IRequestHandler<RecallMessageCommand, BaseResponse<bool>>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMessageStatusRepository _messageStatusRepository;
        private readonly IChatNotificationService _chatNotificationService;

        public RecallMessageCommandHandler(
            IMessageRepository messageRepository,
            IMessageStatusRepository messageStatusRepository,
            IChatNotificationService chatNotificationService)
        {
            _messageRepository = messageRepository;
            _messageStatusRepository = messageStatusRepository;
            _chatNotificationService = chatNotificationService;
        }

        public async Task<BaseResponse<bool>> Handle(RecallMessageCommand request, CancellationToken cancellationToken)
        {
            var message = await _messageRepository.GetByIdAsync(request.MessageId, cancellationToken);

            if (message == null)
            {
                return BaseResponse<bool>.Fail("Tin nhắn không tồn tại.");
            }

            // Only the sender can recall the message
            if (message.SenderId != request.CurrentUserId)
            {
                return BaseResponse<bool>.Fail("Bạn không có quyền thu hồi tin nhắn này.");
            }

            // Mark message as deleted
            message.IsDeleted = true;
            await _messageRepository.UpdateAsync(message, cancellationToken);

            // Update all status records to Recalled
            await _messageStatusRepository.RecallMessageAsync(request.MessageId, cancellationToken);

            // Notify all conversation members about the recall
            var memberUserIds = message.Conversation.Members
                .Select(m => m.UserId)
                .ToList();

            await _chatNotificationService.NotifyMessageRecalledAsync(
                memberUserIds,
                message.ConversationId,
                message.Id,
                cancellationToken);

            return BaseResponse<bool>.Ok(true, "Tin nhắn đã được thu hồi.");
        }
    }
}
