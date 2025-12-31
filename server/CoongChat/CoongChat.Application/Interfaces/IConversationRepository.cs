using CoongChat.Application.Common.Models;
using CoongChat.Domain.Entities;

namespace CoongChat.Application.Interfaces
{
    public interface IConversationRepository
    {
        Task<Conversation?> GetPrivateConversationAsync(Guid user1Id, Guid user2Id, CancellationToken cancellationToken);
        Task AddAsync(Conversation conversation, CancellationToken cancellationToken);
        Task<Conversation?> GetByConversationByIdAsync(Guid conversationId, CancellationToken cancellationToken);
        Task<PagedResult<Conversation>> GetUserConversationsAsync(Guid userId, BaseFilter filter, CancellationToken cancellationToken);
        Task UpdateAsync(Conversation conversation, CancellationToken cancellationToken);
    }
}
