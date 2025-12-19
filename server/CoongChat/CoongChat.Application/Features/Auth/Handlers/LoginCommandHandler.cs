
using CoongChat.Application.Common.Exceptions;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Auth.Commands;
using CoongChat.Application.Features.Auth.DTOs;
using CoongChat.Application.Interfaces;
using MediatR;

namespace CoongChat.Application.Features.Auth.Handlers
{
    public class LoginCommandHandler
        : IRequestHandler<LoginCommand, BaseResponse<AuthDto>>
    {
        private readonly IUserRepository _repo;
        private readonly IPasswordHasher _hasher;
        private readonly IJwtTokenService _jwt;

        public LoginCommandHandler(
            IUserRepository repo,
            IPasswordHasher hasher,
            IJwtTokenService jwt)
        {
            _repo = repo;
            _hasher = hasher;
            _jwt = jwt;
        }

        public async Task<BaseResponse<AuthDto>> Handle(
            LoginCommand request,
            CancellationToken ct)
        {
            var user = await _repo.GetByUsernameOrEmailAsync(request.UsernameOrEmail)
                ?? throw new UnauthorizedException("Không tìm thấy thông tin tài khoản");

            if (!_hasher.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedException("Mật khẩu không hợp lệ");

            var accessToken = _jwt.GenerateAccessToken(user);
            var refreshToken = _jwt.GenerateRefreshToken(user);

            await _repo.SaveRefreshTokenAsync(user.Id, refreshToken);
            var data = new AuthDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

            return BaseResponse<AuthDto>.Ok(data, "Đăng nhập thành công");
        }
    }
}


