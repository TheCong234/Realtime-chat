using CoongChat.Application.Common.Exceptions;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Auth.Commands;
using CoongChat.Application.Features.Auth.DTOs;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using MediatR;

public class RegisterUserCommandHandler
    : IRequestHandler<RegisterUserCommand, BaseResponse<AuthDto>>
{
    private readonly IUserRepository _repo;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenService _jwt;

    public RegisterUserCommandHandler(
        IUserRepository repo,
        IPasswordHasher hasher,
        IJwtTokenService jwt)
    {
        _repo = repo;
        _hasher = hasher;
        _jwt = jwt;
    }

    public async Task<BaseResponse<AuthDto>> Handle(
        RegisterUserCommand request,
        CancellationToken ct)
    {
        if (await _repo.ExistsAsync(request.Username, request.Email))
            throw new UnauthorizedException("Tên người dùng hoạc Email đã tồn tại");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = _hasher.Hash(request.Password),
            CreatedAt = DateTime.UtcNow,
            IsActive = true,
            Role = "User"
        };
        await _repo.AddAsync(user);
        var data = new AuthDto
        {
            AccessToken = _jwt.GenerateAccessToken(user),
            RefreshToken = _jwt.GenerateRefreshToken(user)
        };

        return BaseResponse<AuthDto>.Ok(data, "Đăng ký thành công");
    }
}
