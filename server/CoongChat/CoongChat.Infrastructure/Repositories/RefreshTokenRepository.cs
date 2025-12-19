using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using CoongChat.Infrastructure.Persistence;

namespace CoongChat.Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly AppDbContext _context;

        public RefreshTokenRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<RefreshToken?> GetAsync(string token)
        {
            return await _context.RefreshTokens
                .FindAsync(token);
        }

        public async Task AddAsync(RefreshToken token)
        {
            _context.RefreshTokens.Add(token);
            await _context.SaveChangesAsync();
        }

        public async Task RevokeAsync(string token)
        {
            var refreshToken = await _context.RefreshTokens.FindAsync(token);
            if (refreshToken != null)
            {
                _context.RefreshTokens.Remove(refreshToken);
                await _context.SaveChangesAsync();
            }

        }
    }
}
