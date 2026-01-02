using CoongChat.Application.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace CoongChat.Infrastructure.Services
{
    public class TransactionWrapper : ITransaction
    {
        private readonly IDbContextTransaction _transaction;

        public TransactionWrapper(IDbContextTransaction transaction)
        {
            _transaction = transaction;
        }

        public async Task CommitAsync(CancellationToken cancellationToken = default)
        {
            await _transaction.CommitAsync(cancellationToken);
        }

        public async Task RollbackAsync(CancellationToken cancellationToken = default)
        {
            await _transaction.RollbackAsync(cancellationToken);
        }

        public void Dispose()
        {
            _transaction?.Dispose();
        }
    }
}
