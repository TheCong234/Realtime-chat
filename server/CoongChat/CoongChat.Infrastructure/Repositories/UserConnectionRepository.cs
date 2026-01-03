using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using CoongChat.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CoongChat.Infrastructure.Repositories
{
    public class UserConnectionRepository : IUserConnectionRepository
    {
        private readonly AppDbContext _context;

        public UserConnectionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(UserConnection connection, CancellationToken ct = default)
        {
            _context.UserConnections.Add(connection);
            await _context.SaveChangesAsync(ct);
        }

        public async Task RemoveByConnectionIdAsync(string connectionId, CancellationToken ct = default)
        {
            var connection = await _context.UserConnections
                .FirstOrDefaultAsync(x => x.ConnectionId == connectionId, ct);

            if (connection != null)
            {
                _context.UserConnections.Remove(connection);
                await _context.SaveChangesAsync(ct);
            }
        }

        public async Task<List<string>> GetConnectionIdsByUserIdAsync(Guid userId, CancellationToken ct = default)
        {
            return await _context.UserConnections
                .AsNoTracking()
                .Where(x => x.UserId == userId)
                .Select(x => x.ConnectionId)
                .ToListAsync(ct);
        }

        public async Task<int> GetConnectionCountByUserIdAsync(Guid userId, CancellationToken ct = default)
        {
            return await _context.UserConnections
                .AsNoTracking()
                .CountAsync(x => x.UserId == userId, ct);
        }

        public async Task<List<Guid>> GetOnlineUserIdsAsync(CancellationToken ct = default)
        {
            return await _context.UserConnections
                .AsNoTracking()
                .Select(x => x.UserId)
                .Distinct()
                .ToListAsync(ct);
        }
    }
}
