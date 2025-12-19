using CoongChat.Application.Features.Auth.DTOs;
using MediatR;

namespace CoongChat.Application.Features.Auth.Commands
{
    public record RefreshTokenCommand(
        string RefreshToken
    ) : IRequest<AuthResponse>;
}
