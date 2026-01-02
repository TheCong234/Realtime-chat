namespace CoongChat.Application.Interfaces
{
    public interface IDatabaseService
    {
        Task<ITransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
    }
}
