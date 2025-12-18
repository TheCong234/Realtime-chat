using CoongChat.Domain.Entities;

namespace CoongChat.Application.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken(User user);
    }
}


