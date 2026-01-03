using AutoMapper;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Messages.Dto;
using CoongChat.Application.Interfaces;
using MediatR;

namespace CoongChat.Application.Features.Messages.Queries
{
    public class GetMessagesByConversationIdHandler : IRequestHandler<GetMessagesByConversationIdQuery, BaseResponse<PagedResult<MessageDto>>>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IConversationRepository _conversationRepository;
        private readonly IMapper _mapper;

        public GetMessagesByConversationIdHandler(
            IMessageRepository messageRepository,
            IConversationRepository conversationRepository,
            IMapper mapper)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _mapper = mapper;
        }

        public async Task<BaseResponse<PagedResult<MessageDto>>> Handle(GetMessagesByConversationIdQuery request, CancellationToken cancellationToken)
        {
            var member = await _conversationRepository.GetMemberAsync(request.ConversationId, request.CurrentUserId, cancellationToken);
            if (member == null)
            {
                return BaseResponse<PagedResult<MessageDto>>.Fail("Bạn không phải là thành viên của cuộc hội thoại này");
            }

            var pagedMessages = await _messageRepository.GetPagedMessagesAsync(
                request.ConversationId,
                request.PageNumber,
                request.PageSize,
                member.DeletedAt,
                cancellationToken);

            var mappedItems = _mapper.Map<IReadOnlyList<MessageDto>>(pagedMessages.Items);

            return BaseResponse<PagedResult<MessageDto>>.Ok(new PagedResult<MessageDto>
            {
                PageNumber = pagedMessages.PageNumber,
                PageSize = pagedMessages.PageSize,
                TotalCount = pagedMessages.TotalCount,
                Items = mappedItems,
                HasNextPage = pagedMessages.TotalCount > request.PageSize * request.PageNumber,
            }, "Lấy danh sách Messages thành công");
        }
    }
}
