using CoongChat.Application.Interfaces;
using CoongChat.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Storage;

namespace CoongChat.Infrastructure.Services
{
    public class DatabaseService : IDatabaseService
    {
        private readonly AppDbContext _context;

        public DatabaseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ITransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            var efTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
            return new TransactionWrapper(efTransaction);
        }
    }
}
