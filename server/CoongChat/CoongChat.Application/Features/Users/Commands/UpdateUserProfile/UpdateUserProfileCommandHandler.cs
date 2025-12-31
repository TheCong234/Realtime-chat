using AutoMapper;
using CoongChat.Application.Common.Exceptions;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Users.DTOs;
using CoongChat.Application.Interfaces;
using MediatR;

namespace CoongChat.Application.Features.Users.Commands.UpdateUserProfile
{
    public class UpdateUserProfileCommandHandler : IRequestHandler<UpdateUserProfileCommand, BaseResponse<UserDto>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IMapper _mapper;

        public UpdateUserProfileCommandHandler(
            IUserRepository userRepository,
            IFileStorageService fileStorageService,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _fileStorageService = fileStorageService;
            _mapper = mapper;
        }

        public async Task<BaseResponse<UserDto>> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId);

            if (user == null)
            {
                return BaseResponse<UserDto>.Fail("Không tìm thấy người dùng");
            }

            // Update FullName if provided
            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                user.FullName = request.FullName;
            }

            // Update PhoneNumber if provided
            if (request.PhoneNumber != null)
            {
                user.PhoneNumber = request.PhoneNumber;
            }

            // Handle avatar upload
            if (request.AvatarFile != null && request.AvatarFile.Length > 0)
            {
                // Delete old avatar if exists
                if (!string.IsNullOrEmpty(user.AvatarUrl))
                {
                    await _fileStorageService.DeleteFileAsync(user.AvatarUrl, cancellationToken);
                }

                // Save new avatar
                var avatarUrl = await _fileStorageService.SaveFileAsync(
                    request.AvatarFile,
                    "avatars",
                    cancellationToken);

                user.AvatarUrl = avatarUrl;
            }

            await _userRepository.UpdateAsync(user);

            var userDto = _mapper.Map<UserDto>(user);

            return BaseResponse<UserDto>.Ok(userDto, "Cập nhật hồ sơ thành công");
        }
    }
}
