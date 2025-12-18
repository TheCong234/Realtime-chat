using CoongChat.Application.Features.Auth.Commands;
using CoongChat.Application.Features.Auth.DTOs;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Entities;
using MediatR;

namespace CoongChat.Application.Features.Auth.Handlers
{
    public class RefreshTokenCommandHandler
        : IRequestHandler<RefreshTokenCommand, AuthResponse>
    {
        private readonly IRefreshTokenRepository _refreshTokenRepo;
        private readonly IUserRepository _userRepo;
        private readonly IJwtTokenService _jwt;

        public RefreshTokenCommandHandler(
            IRefreshTokenRepository refreshTokenRepo,
            IUserRepository userRepo,
            IJwtTokenService jwt)
        {
            _refreshTokenRepo = refreshTokenRepo;
            _userRepo = userRepo;
            _jwt = jwt;
        }

        public async Task<AuthResponse> Handle(
            RefreshTokenCommand request,
            CancellationToken ct)
        {
            // 1️⃣ Lấy refresh token từ DB
            var refreshToken = await _refreshTokenRepo.GetAsync(request.RefreshToken)
                ?? throw new Exception("Invalid refresh token");

            // 2️⃣ Kiểm tra trạng thái token
            if (refreshToken.IsRevoked)
                throw new Exception("Refresh token revoked");

            if (refreshToken.ExpiresAt < DateTime.UtcNow)
                throw new Exception("Refresh token expired");

            // 3️⃣ Lấy user
            var user = await _userRepo.GetByIdAsync(refreshToken.UserId)
                ?? throw new Exception("User not found");

            if (!user.IsActive)
                throw new Exception("User is inactive");

            // 4️⃣ Revoke refresh token cũ (ROTATION)
            await _refreshTokenRepo.RevokeAsync(refreshToken.Token);

            // 5️⃣ Tạo token mới
            var newAccessToken = _jwt.GenerateAccessToken(user);
            var newRefreshTokenValue = _jwt.GenerateRefreshToken(user);

            var newRefreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = newRefreshTokenValue,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            await _refreshTokenRepo.AddAsync(newRefreshToken);

            // 6️⃣ Trả về client
            return new AuthResponse(
                newAccessToken,
                newRefreshTokenValue
            );
        }
    }
}
