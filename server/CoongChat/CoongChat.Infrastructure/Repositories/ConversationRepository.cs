using CoongChat.Application.Common.Models;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Common;
using CoongChat.Domain.Entities;
using CoongChat.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CoongChat.Infrastructure.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly AppDbContext _context;

        public ConversationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Conversation?> GetPrivateConversationAsync(Guid user1Id, Guid user2Id, CancellationToken cancellationToken)
        {
            return await _context.Conversations
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .Where(c => c.Type == ConversationType.Private &&
                            c.Members.Any(m => m.UserId == user1Id) &&
                            c.Members.Any(m => m.UserId == user2Id))
                .FirstOrDefaultAsync();
        }

        public async Task<PagedResult<Conversation>> GetUserConversationsAsync(Guid userId, BaseFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.Conversations
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .Include(c => c.LastMessage)
                    .ThenInclude(m => m.Sender)
                .Where(c => c.Members.Any(m =>
                    m.UserId == userId &&
                    (m.DeletedAt == null || (c.LastMessage != null && c.LastMessage.CreatedAt > m.DeletedAt))
                ))
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var search = filter.Search.Trim().ToLower();

                query = query.Where(c => c.Members.Any(m =>
                    m.UserId != userId && (
                        m.User.Username.ToLower().Contains(search) ||
                        m.User.FullName.ToLower().Contains(search) ||
                        m.User.PhoneNumber.Contains(search)
                    )
                ));
            }

            query = query.OrderByDescending(c => c.LastMessage != null
                ? c.LastMessage.CreatedAt
                : c.CreatedAt); // Giả sử Conversation có trường CreatedAt

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
               .Skip((filter.PageNumber - 1) * filter.PageSize)
               .Take(filter.PageSize)
               .ToListAsync(cancellationToken);

            return new PagedResult<Conversation>
            {
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = totalCount,
                Items = items
            };
        }

        public async Task AddAsync(Conversation conversation, CancellationToken cancellationToken)
        {
            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();
        }

        public async Task<Conversation?> GetByConversationByIdAsync(Guid conversationId, CancellationToken cancellationToken)
        {
            return await _context.Conversations
                .Include(c => c.Members)
                    .ThenInclude(m => m.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);
        }

        public async Task UpdateAsync(Conversation conversation, CancellationToken cancellationToken)
        {
            _context.Conversations.Update(conversation);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<ConversationMember?> GetMemberAsync(Guid conversationId, Guid userId, CancellationToken cancellationToken)
        {
            return await _context.ConversationMembers
                .FirstOrDefaultAsync(m => m.ConversationId == conversationId && m.UserId == userId, cancellationToken);
        }

        public async Task UpdateMemberAsync(ConversationMember member, CancellationToken cancellationToken)
        {
            _context.ConversationMembers.Update(member);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<Guid>> GetMemberUserIdsAsync(Guid conversationId, CancellationToken cancellationToken)
        {
            return await _context.ConversationMembers
                .AsNoTracking()
                .Where(m => m.ConversationId == conversationId)
                .Select(m => m.UserId)
                .ToListAsync(cancellationToken);
        }
    }
}
