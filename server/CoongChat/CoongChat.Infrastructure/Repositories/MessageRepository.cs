using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using CoongChat.Infrastructure.Persistence;

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
    }
}
