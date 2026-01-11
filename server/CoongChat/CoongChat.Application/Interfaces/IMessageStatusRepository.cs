using CoongChat.Domain.Common;
using CoongChat.Domain.Entities;

namespace CoongChat.Application.Interfaces
{
    public interface IMessageStatusRepository
    {
        Task AddAsync(MessageStatus status, CancellationToken ct = default);
        Task<MessageStatus?> GetAsync(Guid messageId, Guid userId, CancellationToken ct = default);
        Task UpdateStatusAsync(Guid messageId, Guid userId, MessageReadStatus newStatus, CancellationToken ct = default);
        Task CreateForRecipientsAsync(Guid messageId, List<Guid> recipientIds, CancellationToken ct = default);
        Task MarkAllAsDeliveredAsync(Guid userId, Guid conversationId, CancellationToken ct = default);
        Task MarkAllAsSeenAsync(Guid userId, Guid conversationId, CancellationToken ct = default);
        Task<List<Guid>> MarkAllAsSeenAndGetSenderIdsAsync(Guid userId, Guid conversationId, CancellationToken ct = default);
        Task<List<MessageStatus>> GetStatusesByMessageIdAsync(Guid messageId, CancellationToken ct = default);
        Task RecallMessageAsync(Guid messageId, CancellationToken ct = default);
        Task<MessageReadStatus> GetAggregatedStatusAsync(Guid messageId, Guid? viewerUserId, Guid senderId, CancellationToken ct = default);
    }
}
