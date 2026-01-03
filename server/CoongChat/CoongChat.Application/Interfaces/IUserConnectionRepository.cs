using CoongChat.Domain.Entities;

namespace CoongChat.Application.Interfaces
{
    public interface IUserConnectionRepository
    {
        Task AddAsync(UserConnection connection, CancellationToken ct = default);
        Task RemoveByConnectionIdAsync(string connectionId, CancellationToken ct = default);
        Task<List<string>> GetConnectionIdsByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task<int> GetConnectionCountByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task<List<Guid>> GetOnlineUserIdsAsync(CancellationToken ct = default);
    }
}
