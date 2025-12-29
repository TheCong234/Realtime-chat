using AutoMapper;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Conversations.Dto;
using CoongChat.Application.Interfaces;
using MediatR;

namespace CoongChat.Application.Features.Conversations.Queries.GetConversationDetails
{
    public class GetConversationDetailsQueryHandler : IRequestHandler<GetConversationDetailsQuery, BaseResponse<ConversationDto>>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IMapper _mapper;

        public GetConversationDetailsQueryHandler(IConversationRepository conversationRepository, IMapper mapper)
        {
            _conversationRepository = conversationRepository;
            _mapper = mapper;
        }

        public async Task<BaseResponse<ConversationDto>> Handle(GetConversationDetailsQuery request, CancellationToken cancellationToken)
        {
            var conversation = await _conversationRepository.GetByConversationByIdAsync(request.ConversationId, cancellationToken);

            if (conversation == null)
            {
                throw new KeyNotFoundException("Cuộc hội thoại không tồn tại");
            }

            if (!conversation.Members.Any(m => m.UserId == request.CurrentUserId))
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập cuộc hội thoại này");
            }

            return BaseResponse<ConversationDto>.Ok(_mapper.Map<ConversationDto>(conversation), "Lấy thông tin cuộc hội thoại thành công");
        }
    }
}
