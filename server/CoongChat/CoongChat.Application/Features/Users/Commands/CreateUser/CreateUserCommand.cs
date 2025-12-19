using MediatR;

namespace CoongChat.Application.Features.Users.Commands.CreateUser
{
    public record CreateUserCommand(
    string Username,
    string Email,
    string Password,
    string? AvatarUrl
) : IRequest<Guid>;
}
