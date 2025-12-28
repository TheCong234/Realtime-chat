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
        private readonly IMapper _mapper;

        public GetMessagesByConversationIdHandler(IMessageRepository messageRepository, IMapper mapper)
        {
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        public async Task<BaseResponse<PagedResult<MessageDto>>> Handle(GetMessagesByConversationIdQuery request, CancellationToken cancellationToken)
        {
            var pagedMessages = await _messageRepository.GetPagedMessagesAsync(
                request.ConversationId,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            var mappedItems = _mapper.Map<IReadOnlyList<MessageDto>>(pagedMessages.Items);

            return BaseResponse<PagedResult<MessageDto>>.Ok(new PagedResult<MessageDto>
            {
                PageNumber = pagedMessages.PageNumber,
                PageSize = pagedMessages.PageSize,
                TotalCount = pagedMessages.TotalCount,
                Items = mappedItems
            }, "Lấy danh sách Messages thành công");
        }
    }
}
