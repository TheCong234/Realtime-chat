using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Users.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CoongChat.Application.Features.Users.Commands.UpdateUserProfile
{
    public class UpdateUserProfileCommand : IRequest<BaseResponse<UserDto>>
    {
        public Guid UserId { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public IFormFile? AvatarFile { get; set; }

        public UpdateUserProfileCommand(Guid userId, string? fullName, string? phoneNumber, IFormFile? avatarFile)
        {
            UserId = userId;
            FullName = fullName;
            PhoneNumber = phoneNumber;
            AvatarFile = avatarFile;
        }
    }
}
