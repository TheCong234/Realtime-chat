using CoongChat.Application.Common.Models;
using CoongChat.Application.Filters;
using CoongChat.Domain.Entities;

namespace CoongChat.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByUsernameOrEmailAsync(string usernameOrEmail);
        Task<PagedResult<User>> GetPagedAsync(GetUsersFilter filter, CancellationToken cancellationToken);
        Task<Boolean> ExistsAsync(string username, string email);

        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(User user);
        Task SaveRefreshTokenAsync(Guid userId, string refreshToken);
    }
}
