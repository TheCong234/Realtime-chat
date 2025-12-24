using CoongChat.Application.Common.Models;
using CoongChat.Application.Filters;
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
        public async Task<PagedResult<User>> GetPagedAsync(GetUsersFilter filter, CancellationToken cancellationToken)
        {
            var query = _context.Users
                .AsNoTracking()
                .Where(x => x.IsActive);

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var keyword = filter.Search.Trim().ToLower();
                query = query.Where(x =>
                    x.Username.ToLower().Contains(keyword) ||
                    x.Email.ToLower().Contains(keyword) ||
                    (x.FullName != null && x.FullName.ToLower().Contains(keyword)));
            }

            if (filter.CreatedFrom.HasValue)
            {
                query = query.Where(x => x.CreatedAt >= filter.CreatedFrom.Value);
            }

            if (filter.CreatedTo.HasValue)
            {
                query = query.Where(x => x.CreatedAt <= filter.CreatedTo.Value);
            }

            if (filter.Status.HasValue)
            {
                query = query.Where(x => x.Status == filter.Status.Value);
            }
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                query = filter.IsDescending
                    ? query.OrderByDescending(e => EF.Property<object>(e, filter.SortBy))
                    : query.OrderBy(e => EF.Property<object>(e, filter.SortBy));
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResult<User>
            {
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = totalCount,
                Items = items
            };
        }

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
