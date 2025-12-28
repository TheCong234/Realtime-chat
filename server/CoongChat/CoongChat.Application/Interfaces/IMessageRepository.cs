using CoongChat.Domain.Entities;
using CoongChat.Application.Common.Models;

namespace CoongChat.Application.Interfaces
{
    public interface IMessageRepository
    {
        Task AddAsync(Message message, CancellationToken cancellationToken);
        Task<PagedResult<Message>> GetPagedMessagesAsync(Guid conversationId, int pageNumber, int pageSize, CancellationToken cancellationToken);
    }
}
