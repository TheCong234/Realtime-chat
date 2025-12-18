using MediatR;

public record CreateUserCommand(
    string Username,
    string Email,
    string Password,
    string? AvatarUrl
) : IRequest<Guid>;
