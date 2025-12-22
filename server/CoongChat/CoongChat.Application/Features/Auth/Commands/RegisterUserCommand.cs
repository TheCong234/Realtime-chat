using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Auth.DTOs;
using MediatR;

namespace CoongChat.Application.Features.Auth.Commands
{
    public record RegisterUserCommand(
        string? FullName,
    string Username,
    string Email,
    string Password,
    string? PhoneNumber
) : IRequest<BaseResponse<AuthDto>>;
}
