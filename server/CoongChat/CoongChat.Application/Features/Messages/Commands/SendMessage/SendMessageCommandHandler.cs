using AutoMapper;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Messages.Dto;
using CoongChat.Application.Helpers;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using MediatR;

namespace CoongChat.Application.Features.Messages.Commands.SendMessage
{
    public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, BaseResponse<MessageDto>>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IConversationRepository _conversationRepository;

        private readonly IMapper _mapper;

        public SendMessageCommandHandler(
            IMessageRepository messageRepository,
            IConversationRepository conversationRepository,
            IMapper mapper)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _mapper = mapper;
        }

        public async Task<BaseResponse<MessageDto>> Handle(
     SendMessageCommand request,
     CancellationToken cancellationToken)
        {
            if (request.CurrentUserId == request.TargetUserId)
            {
                throw new Exception("Không thể nhắn tin cho chính mình.");
            }

            var conversation = await _conversationRepository
                .GetByConversationByIdAsync(request.ConversationId, cancellationToken);

            if (conversation == null)
            {
                conversation = await _conversationRepository.GetPrivateConversationAsync(
                        request.CurrentUserId, request.TargetUserId, cancellationToken);
                if (conversation == null)
                {
                    conversation = ConversationHelper.CreateNewPrivateConversation(request);
                    await _conversationRepository.AddAsync(conversation, cancellationToken);
                }

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

            return BaseResponse<MessageDto>.Ok(_mapper.Map<MessageDto>(message), "Tin nhắn đã được gửi"
            );
        }

    }
}
