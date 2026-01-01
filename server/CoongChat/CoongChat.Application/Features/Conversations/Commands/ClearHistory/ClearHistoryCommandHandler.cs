using CoongChat.Application.Common.Models;
using CoongChat.Application.Interfaces;
using MediatR;

namespace CoongChat.Application.Features.Conversations.Commands.ClearHistory
{
    public class ClearHistoryCommandHandler : IRequestHandler<ClearHistoryCommand, BaseResponse<bool>>
    {
        private readonly IConversationRepository _conversationRepository;

        public ClearHistoryCommandHandler(IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }

        public async Task<BaseResponse<bool>> Handle(ClearHistoryCommand request, CancellationToken cancellationToken)
        {
            var member = await _conversationRepository.GetMemberAsync(request.ConversationId, request.CurrentUserId, cancellationToken);
            if (member == null)
            {
                return BaseResponse<bool>.Fail("Bạn không phải là thành viên của cuộc hội thoại này");
            }

            member.DeletedAt = DateTime.UtcNow;
            await _conversationRepository.UpdateMemberAsync(member, cancellationToken);

            return BaseResponse<bool>.Ok(true, "Đã xóa lịch sử trò chuyện");
        }
    }
}
