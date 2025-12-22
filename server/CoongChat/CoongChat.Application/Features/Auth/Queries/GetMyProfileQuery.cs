using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Users.DTOs;
using MediatR;

namespace CoongChat.Application.Features.Auth.Queries
{
    public record GetMyProfileQuery(Guid userId) : IRequest<BaseResponse<UserDto>>;
}
