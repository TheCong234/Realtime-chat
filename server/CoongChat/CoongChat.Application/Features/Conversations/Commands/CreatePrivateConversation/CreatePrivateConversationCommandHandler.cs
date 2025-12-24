using AutoMapper;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Conversations.Dto;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Common;
using CoongChat.Domain.Entities;
using MediatR;

namespace CoongChat.Application.Features.Conversations.Commands.CreatePrivateConversation
{
    public class CreatePrivateConversationCommandHandler : IRequestHandler<CreatePrivateConversationCommand, BaseResponse<ConversationDto>>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public CreatePrivateConversationCommandHandler(
            IConversationRepository conversationRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _conversationRepository = conversationRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<BaseResponse<ConversationDto>> Handle(CreatePrivateConversationCommand request, CancellationToken cancellationToken)
        {
            var targetUser = await _userRepository.GetByIdAsync(request.TargetUserId);
            if (targetUser == null)
            {
                throw new KeyNotFoundException($"User with ID {request.TargetUserId} not found.");
            }

            var currentUser = await _userRepository.GetByIdAsync(request.CurrentUserId);
            if (currentUser == null)
            {
                throw new KeyNotFoundException($"Current User with ID {request.CurrentUserId} not found.");
            }

            var existingConversation = await _conversationRepository.GetPrivateConversationAsync(request.CurrentUserId, request.TargetUserId, cancellationToken);
            if (existingConversation != null)
            {
                var existingData = _mapper.Map<ConversationDto>(existingConversation);
                return BaseResponse<ConversationDto>.Ok(existingData, "Cuộc hội thoại đã tồn tại");
            }

            var newConversation = new Conversation
            {
                Id = Guid.NewGuid(),
                Type = ConversationType.Private,
                CreatedAt = DateTime.UtcNow,
                Members = new List<ConversationMember>
                {
                    new ConversationMember
                    {
                        UserId = request.CurrentUserId,
                        Role = ConversationRole.Member,
                        JoinedAt = DateTime.UtcNow
                    },
                    new ConversationMember
                    {
                        UserId = request.TargetUserId,
                        Role = ConversationRole.Member,
                        JoinedAt = DateTime.UtcNow
                    }
                }
            };

            await _conversationRepository.AddAsync(newConversation, cancellationToken);
            var createdConversation = await _conversationRepository.GetPrivateConversationAsync(request.CurrentUserId, request.TargetUserId, cancellationToken);

            var data = _mapper.Map<ConversationDto>(existingConversation);
            return BaseResponse<ConversationDto>.Ok(data, "Tạo cuộc hội thoại thành công");
        }
    }
}
