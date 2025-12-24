using CoongChat.Domain.Entities;

namespace CoongChat.Application.Interfaces
{
    public interface IMessageRepository
    {
        Task AddAsync(Message message, CancellationToken cancellationToken);
    }
}
