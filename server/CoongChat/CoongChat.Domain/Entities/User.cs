using CoongChat.Domain.Common;

namespace CoongChat.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public string Username { get; set; }
        public string? FullName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }

        public string PasswordHash { get; set; }

        public bool EmailConfirmed { get; set; } = false;
        public bool PhoneConfirmed { get; set; } = false;

        public DateTime CreatedAt { get; set; }
        public DateTime? LastOnlineAt { get; set; }
        public string? AvatarUrl { get; set; }

        public UserStatus Status { get; set; } // Online / Offline / Away
        public bool IsActive { get; set; } = true;
        public string Role { get; set; } = "User"; // e.g., "Admin", "User"

        // Navigation
        public ICollection<RefreshToken> RefreshTokens { get; set; }
    }
}
