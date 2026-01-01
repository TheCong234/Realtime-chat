using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using CoongChat.Infrastructure.Persistence;
using CoongChat.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace CoongChat.Infrastructure.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext _context;

        public MessageRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Message message, CancellationToken cancellationToken)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
        }

        public async Task<PagedResult<Message>> GetPagedMessagesAsync(Guid conversationId, int pageNumber, int pageSize, DateTime? fromDate, CancellationToken cancellationToken)
        {
            var query = _context.Messages
                .Include(m => m.Sender)
                .Where(m => m.ConversationId == conversationId)
                .AsQueryable();

            if (fromDate.HasValue)
            {
                query = query.Where(m => m.CreatedAt > fromDate.Value);
            }

            query = query.OrderByDescending(m => m.CreatedAt);

            var totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return new PagedResult<Message>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = items
            };
        }
    }
}
