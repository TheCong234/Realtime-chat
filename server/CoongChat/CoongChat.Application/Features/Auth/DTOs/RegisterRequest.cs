namespace CoongChat.Application.Features.Auth.DTOs
{
    public record RegisterRequest(
        string? FullName,
        string Username,
        string Email,
        string Password,
        string? PhoneNumber
    );
}

