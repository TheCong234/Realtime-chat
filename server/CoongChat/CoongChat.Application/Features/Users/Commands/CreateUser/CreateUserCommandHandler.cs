using System.Security.Cryptography;
using System.Text;
using CoongChat.Application.Features.Users.Commands.CreateUser;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using MediatR;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
{
    private readonly IUserRepository _repo;

    public CreateUserCommandHandler(IUserRepository repo)
    {
        _repo = repo;
    }

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken ct)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            AvatarUrl = request.AvatarUrl,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        await _repo.AddAsync(user);
        return user.Id;
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        return Convert.ToBase64String(
            sha256.ComputeHash(Encoding.UTF8.GetBytes(password))
        );
    }
}
