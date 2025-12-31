using AutoMapper;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Conversations.Dto;
using CoongChat.Application.Interfaces;
using MediatR;

namespace CoongChat.Application.Features.Conversations.Queries.GetMyConversations
{
    public class GetMyConversationsQueryHandler : IRequestHandler<GetMyConversationsQuery, BaseResponse<PagedResult<ConversationDto>>>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public GetMyConversationsQueryHandler(IConversationRepository conversationRepository, IUserRepository userRepository, IMapper mapper)
        {
            _conversationRepository = conversationRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<BaseResponse<PagedResult<ConversationDto>>> Handle(GetMyConversationsQuery request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.CurrentUserId) ?? throw new KeyNotFoundException("Người dùng không tồn tại");
            var data = await _conversationRepository.GetUserConversationsAsync(request.CurrentUserId, new BaseFilter
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                Search = request.Search
            }, cancellationToken);

            foreach (var conversation in data.Items)
            {
                var member = conversation.Members.FirstOrDefault(m => m.UserId == request.CurrentUserId);
                if (member?.DeletedAt != null && conversation.LastMessage != null && conversation.LastMessage.CreatedAt <= member.DeletedAt)
                {
                    conversation.LastMessage = null;
                    conversation.LastMessageId = null; 
                }
            }

            return BaseResponse<PagedResult<ConversationDto>>.Ok(new PagedResult<ConversationDto>
            {
                PageNumber = data.PageNumber,
                PageSize = data.PageSize,
                TotalCount = data.TotalCount,
                Items = _mapper.Map<List<ConversationDto>>(data.Items)
            }, "Lây danh sách cuộc hội thoại thành công");
        }
    }
}
