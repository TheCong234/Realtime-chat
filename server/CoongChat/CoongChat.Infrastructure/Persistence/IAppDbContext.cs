using System.Collections.Generic;
using CoongChat.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoongChat.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<User> Users { get; }

        DbSet<Conversation> Conversations { get; }
        DbSet<ConversationMember> ConversationMembers { get; }

        DbSet<Message> Messages { get; }
        DbSet<MessageStatus> MessageStatuses { get; }
        DbSet<MessageAttachment> MessageAttachments { get; }

        DbSet<Notification> Notifications { get; }

        DbSet<RefreshToken> RefreshTokens { get; }
        DbSet<OtpCode> OtpCodes { get; }

        DbSet<UserConnection> UserConnections { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
