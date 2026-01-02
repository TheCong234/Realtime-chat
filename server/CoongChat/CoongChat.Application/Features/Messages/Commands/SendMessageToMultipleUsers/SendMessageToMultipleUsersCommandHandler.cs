using AutoMapper;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Messages.Dto;
using CoongChat.Application.Helpers;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using MediatR;

namespace CoongChat.Application.Features.Messages.Commands.SendMessageToMultipleUsers
{
    public class SendMessageToMultipleUsersCommandHandler : IRequestHandler<SendMessageToMultipleUsersCommand, BaseResponse<MessageDto>>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IConversationRepository _conversationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IDatabaseService _databaseService;
        private readonly IMapper _mapper;

        public SendMessageToMultipleUsersCommandHandler(
            IMessageRepository messageRepository,
            IConversationRepository conversationRepository,
            IUserRepository userRepository,
            IDatabaseService databaseService,
            IMapper mapper)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _userRepository = userRepository;
            _databaseService = databaseService;
            _mapper = mapper;
        }

        public async Task<BaseResponse<MessageDto>> Handle(
            SendMessageToMultipleUsersCommand request,
            CancellationToken cancellationToken)
        {
            // Validate all users exist
            var allUsersExist = await _userRepository.AllExistAsync(request.UserIds, cancellationToken);
            if (!allUsersExist)
            {
                throw new Exception("Một hoặc nhiều người dùng không tồn tại trong hệ thống");
            }

            // Begin transaction
            using var transaction = await _databaseService.BeginTransactionAsync(cancellationToken);

            try
            {
                Message? lastMessage = null;

                foreach (var targetUserId in request.UserIds)
                {
                    // Get or create private conversation
                    var conversation = await _conversationRepository.GetPrivateConversationAsync(
                        request.CurrentUserId,
                        targetUserId,
                        cancellationToken);

                    if (conversation == null)
                    {
                        // Create new private conversation
                        conversation = ConversationHelper.CreateNewPrivateConversation(
                            new SendMessageWithoutConversationCommand
                            {
                                CurrentUserId = request.CurrentUserId,
                                TargetUserId = targetUserId
                            });

                        await _conversationRepository.AddAsync(conversation, cancellationToken);
                    }

                    // Create message
                    var message = new Message
                    {
                        Id = Guid.NewGuid(),
                        ConversationId = conversation.Id,
                        SenderId = request.CurrentUserId,
                        Type = request.Type,
                        Content = request.Content,
                        CreatedAt = DateTime.UtcNow,
                        IsDeleted = false
                    };

                    await _messageRepository.AddAsync(message, cancellationToken);

                    // Update conversation's last message
                    conversation.LastMessageId = message.Id;
                    await _conversationRepository.UpdateAsync(conversation, cancellationToken);

                    lastMessage = message;
                }

                // Commit transaction if all succeeded
                await transaction.CommitAsync(cancellationToken);

                // Return the last message
                return BaseResponse<MessageDto>.Ok(
                    _mapper.Map<MessageDto>(lastMessage),
                    $"Tin nhắn đã được gửi thành công cho {request.UserIds.Count} người"
                );
            }
            catch (Exception ex)
            {
                // Rollback transaction on any error
                await transaction.RollbackAsync(cancellationToken);
                throw new Exception($"Lỗi khi gửi tin nhắn: {ex.Message}", ex);
            }
        }
    }

    public class SendMessageWithoutConversationCommand
    {
        public Guid CurrentUserId { get; set; }
        public Guid TargetUserId { get; set; }
    }
}
