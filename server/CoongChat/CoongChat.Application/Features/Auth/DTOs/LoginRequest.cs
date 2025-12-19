namespace CoongChat.Application.Features.Auth.DTOs
{
    public record LoginRequest(
        string UsernameOrEmail,
        string Password
    );
}


