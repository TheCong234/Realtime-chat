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
                .Where(c => c.Members.Any(m => m.UserId == userId))
                .AsNoTracking();
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
    }
}
