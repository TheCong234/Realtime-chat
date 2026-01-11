using CoongChat.Application.Interfaces;
using CoongChat.Domain.Common;
using CoongChat.Domain.Entities;
using CoongChat.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CoongChat.Infrastructure.Repositories
{
    public class MessageStatusRepository : IMessageStatusRepository
    {
        private readonly AppDbContext _context;

        public MessageStatusRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(MessageStatus status, CancellationToken ct = default)
        {
            _context.MessageStates.Add(status);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<MessageStatus?> GetAsync(Guid messageId, Guid userId, CancellationToken ct = default)
        {
            return await _context.MessageStates
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.MessageId == messageId && x.UserId == userId, ct);
        }

        public async Task UpdateStatusAsync(Guid messageId, Guid userId, MessageReadStatus newStatus, CancellationToken ct = default)
        {
            var status = await _context.MessageStates
                .FirstOrDefaultAsync(x => x.MessageId == messageId && x.UserId == userId, ct);

            if (status != null && status.Status < newStatus)
            {
                status.Status = newStatus;
                status.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync(ct);
            }
        }

        public async Task CreateForRecipientsAsync(Guid messageId, List<Guid> recipientIds, CancellationToken ct = default)
        {
            var statuses = recipientIds.Select(userId => new MessageStatus
            {
                MessageId = messageId,
                UserId = userId,
                Status = MessageReadStatus.Sent,
                UpdatedAt = DateTime.UtcNow
            }).ToList();

            _context.MessageStates.AddRange(statuses);
            await _context.SaveChangesAsync(ct);
        }

        public async Task MarkAllAsDeliveredAsync(Guid userId, Guid conversationId, CancellationToken ct = default)
        {
            var messageStatuses = await _context.MessageStates
                .Include(ms => ms.Message)
                .Where(ms => ms.UserId == userId 
                    && ms.Message.ConversationId == conversationId 
                    && ms.Status == MessageReadStatus.Sent)
                .ToListAsync(ct);

            foreach (var status in messageStatuses)
            {
                status.Status = MessageReadStatus.Delivered;
                status.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync(ct);
        }

        public async Task MarkAllAsSeenAsync(Guid userId, Guid conversationId, CancellationToken ct = default)
        {
            var messageStatuses = await _context.MessageStates
                .Include(ms => ms.Message)
                .Where(ms => ms.UserId == userId 
                    && ms.Message.ConversationId == conversationId 
                    && ms.Status != MessageReadStatus.Seen)
                .ToListAsync(ct);

            foreach (var status in messageStatuses)
            {
                status.Status = MessageReadStatus.Seen;
                status.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync(ct);
        }

        public async Task<List<Guid>> MarkAllAsSeenAndGetSenderIdsAsync(Guid userId, Guid conversationId, CancellationToken ct = default)
        {
            var messageStatuses = await _context.MessageStates
                .Include(ms => ms.Message)
                .Where(ms => ms.UserId == userId 
                    && ms.Message.ConversationId == conversationId 
                    && ms.Status != MessageReadStatus.Seen
                    && ms.Status != MessageReadStatus.Recalled)
                .ToListAsync(ct);

            // Get unique sender IDs of affected messages
            var senderIds = messageStatuses
                .Select(ms => ms.Message.SenderId)
                .Distinct()
                .ToList();

            foreach (var status in messageStatuses)
            {
                status.Status = MessageReadStatus.Seen;
                status.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync(ct);

            return senderIds;
        }

        public async Task<List<MessageStatus>> GetStatusesByMessageIdAsync(Guid messageId, CancellationToken ct = default)
        {
            return await _context.MessageStates
                .AsNoTracking()
                .Where(x => x.MessageId == messageId)
                .ToListAsync(ct);
        }

        public async Task RecallMessageAsync(Guid messageId, CancellationToken ct = default)
        {
            var statuses = await _context.MessageStates
                .Where(x => x.MessageId == messageId)
                .ToListAsync(ct);

            foreach (var status in statuses)
            {
                status.Status = MessageReadStatus.Recalled;
                status.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync(ct);
        }

        public async Task<MessageReadStatus> GetAggregatedStatusAsync(Guid messageId, Guid? viewerUserId, Guid senderId, CancellationToken ct = default)
        {
            var statuses = await _context.MessageStates
                .AsNoTracking()
                .Where(x => x.MessageId == messageId)
                .ToListAsync(ct);

            if (!statuses.Any())
            {
                return MessageReadStatus.Sent;
            }

            // If any status is Recalled, return Recalled
            if (statuses.Any(s => s.Status == MessageReadStatus.Recalled))
            {
                return MessageReadStatus.Recalled;
            }

            // If viewer is the sender, return the minimum status (worst case for all recipients)
            if (viewerUserId == senderId || viewerUserId == null)
            {
                return statuses.Min(s => s.Status);
            }

            // If viewer is a recipient, return their own status
            var viewerStatus = statuses.FirstOrDefault(s => s.UserId == viewerUserId);
            return viewerStatus?.Status ?? MessageReadStatus.Sent;
        }

        public async Task<Dictionary<Guid, List<Guid>>> MarkAllAsDeliveredForUserAndGetSendersAsync(Guid userId, CancellationToken ct = default)
        {
            var messageStatuses = await _context.MessageStates
                .Include(ms => ms.Message)
                .Where(ms => ms.UserId == userId && ms.Status == MessageReadStatus.Sent)
                .ToListAsync(ct);

            // Group by conversationId and get unique sender IDs
            var result = messageStatuses
                .GroupBy(ms => ms.Message.ConversationId)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(ms => ms.Message.SenderId).Distinct().ToList()
                );

            foreach (var status in messageStatuses)
            {
                status.Status = MessageReadStatus.Delivered;
                status.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync(ct);

            return result;
        }
    }
}
