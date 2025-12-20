using CoongChat.Domain.Common;

namespace CoongChat.Application.Features.Users.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public string Username { get; set; } = null!;
        public string? FullName { get; set; }

        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }

        public bool EmailConfirmed { get; set; }
        public bool PhoneConfirmed { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? LastOnlineAt { get; set; }

        public string? AvatarUrl { get; set; }

        public UserStatus Status { get; set; }
        public bool IsActive { get; set; }

        public string Role { get; set; } = null!;
    }

}
