using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using CoongChat.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CoongChat.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByUsernameOrEmailAsync(string username)
            => await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Username == username || u.Email == username);

        //ExistsAsync function
        public async Task<bool> ExistsAsync(string username, string email)
            => await _context.Users
                .AsNoTracking()
                .AnyAsync(u => u.Username == username || u.Email == email);

        //SaveRefreshTokenAsync function
        public async Task SaveRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var user = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.UserId == userId);
        }
        public async Task<List<User>> GetAllAsync()
            => await _context.Users.AsNoTracking().ToListAsync();

        public async Task<User?> GetByIdAsync(Guid id)
            => await _context.Users.FindAsync(id);

        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
