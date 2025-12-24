using CoongChat.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoongChat.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
       : base(options)
        {
        }



        #region DbSets  
        public DbSet<Conversation> Conversations => Set<Conversation>();
        public DbSet<ConversationMember> ConversationMembers => Set<ConversationMember>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<MessageAttachment> MessageAttachments => Set<MessageAttachment>();
        public DbSet<MessageStatus> MessageStates => Set<MessageStatus>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<OtpCode> OtpCodes => Set<OtpCode>();
        public DbSet<User> Users => Set<User>();
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<UserConnection> UserConnections => Set<UserConnection>();

        #endregion

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            /* =======================
             * USER
             * ======================= */
            builder.Entity<User>(e =>
            {
                e.HasKey(x => x.Id);

                e.Property(x => x.FullName)
                    .HasMaxLength(255);

                e.Property(x => x.Username)
                    .IsRequired()
                    .HasMaxLength(100);

                e.Property(x => x.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                e.Property(x => x.PhoneNumber)
                    .HasMaxLength(20);

                e.Property(x => x.Status)
                    .HasConversion<int>();

                e.HasIndex(x => x.Email).IsUnique();
                e.HasIndex(x => x.PhoneNumber).IsUnique();
            });

            /* =======================
             * REFRESH TOKEN
             * ======================= */
            builder.Entity<RefreshToken>(e =>
            {
                e.HasKey(x => x.Id);

                e.Property(x => x.Token)
                    .IsRequired()
                    .HasMaxLength(500);

                e.HasIndex(x => x.Token).IsUnique();

                e.HasOne(x => x.User)
                    .WithMany(x => x.RefreshTokens)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            /* =======================
             * OTP
             * ======================= */
            builder.Entity<OtpCode>(e =>
            {
                e.HasKey(x => x.Id);

                e.Property(x => x.Code)
                    .IsRequired()
                    .HasMaxLength(10);

                e.Property(x => x.Type)
                    .HasConversion<int>();

                e.HasIndex(x => new { x.UserId, x.Type });
            });

            /* =======================
             * CONVERSATION
             * ======================= */
            builder.Entity<Conversation>(e =>
            {
                e.HasKey(x => x.Id);

                e.Property(x => x.Type)
                    .HasConversion<int>();

                e.Property(x => x.Name)
                    .HasMaxLength(255)
                    .IsRequired(false);

                e.Property(x => x.AvatarUrl)
                    .IsRequired(false);

                e.HasIndex(x => x.Type);
                e.HasIndex(x => x.CreatedAt);
            });

            /* =======================
             * CONVERSATION MEMBER
             * ======================= */
            builder.Entity<ConversationMember>(e =>
            {
                e.HasKey(x => new { x.ConversationId, x.UserId });

                e.Property(x => x.Role)
                    .HasConversion<int>();

                e.HasOne(x => x.Conversation)
                    .WithMany(x => x.Members)
                    .HasForeignKey(x => x.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(x => x.User)
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasIndex(x => x.UserId);
            });

            /* =======================
             * MESSAGE
             * ======================= */
            builder.Entity<Message>(e =>
            {
                e.HasKey(x => x.Id);

                e.Property(x => x.Type)
                    .HasConversion<int>();

                e.Property(x => x.Content)
                    .HasMaxLength(4000);

                e.HasOne(x => x.Conversation)
                    .WithMany(x => x.Messages)
                    .HasForeignKey(x => x.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(x => x.Sender)
                    .WithMany()
                    .HasForeignKey(x => x.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Query chat list, load message mới nhất
                e.HasIndex(x => new { x.ConversationId, x.CreatedAt });
            });

            /* =======================
             * MESSAGE STATUS
             * ======================= */
            builder.Entity<MessageStatus>(e =>
            {
                e.HasKey(x => new { x.MessageId, x.UserId });

                e.Property(x => x.Status)
                    .HasConversion<int>();

                e.HasOne(x => x.Message)
                    .WithMany(x => x.Statuses)
                    .HasForeignKey(x => x.MessageId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(x => x.User)
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Unread / Seen query
                e.HasIndex(x => new { x.UserId, x.Status });
            });

            /* =======================
             * MESSAGE ATTACHMENT
             * ======================= */
            builder.Entity<MessageAttachment>(e =>
            {
                e.HasKey(x => x.Id);

                e.Property(x => x.FileName)
                    .HasMaxLength(255);

                e.Property(x => x.FileUrl)
                    .IsRequired()
                    .HasMaxLength(1000);

                e.HasOne(x => x.Message)
                    .WithMany(x => x.Attachments)
                    .HasForeignKey(x => x.MessageId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            /* =======================
             * USER CONNECTION (SignalR)
             * ======================= */
            builder.Entity<UserConnection>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasIndex(x => new { x.UserId, x.ConnectionId })
                    .IsUnique();

                e.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            /* =======================
             * NOTIFICATION
             * ======================= */
            builder.Entity<Notification>(e =>
            {
                e.HasKey(x => x.Id);

                e.Property(x => x.Type)
                    .HasConversion<int>();

                e.Property(x => x.Title)
                    .HasMaxLength(255);

                e.HasIndex(x => new { x.UserId, x.IsRead });
                e.HasIndex(x => x.CreatedAt);
            });
        }



    }
}
