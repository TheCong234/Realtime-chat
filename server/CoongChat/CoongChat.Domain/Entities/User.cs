using CoongChat.Domain.Common;

namespace CoongChat.Domain.Entities
{
    public class User : BaseEntity<Guid>
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string? AvatarUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastActiveAt { get; set; }

        public bool IsActive { get; set; } = true;

        public string Role { get; set; } = "User";
    }
}
