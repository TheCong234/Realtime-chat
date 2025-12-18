using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Auth.DTOs;
using MediatR;

namespace CoongChat.Application.Features.Auth.Commands
{
    public record LoginCommand(
    string UsernameOrEmail,
    string Password
) : IRequest<BaseResponse<AuthDto>>;
}


