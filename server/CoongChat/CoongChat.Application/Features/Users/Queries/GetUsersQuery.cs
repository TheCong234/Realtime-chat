using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Users.DTOs;
using CoongChat.Application.Filters;
using MediatR;

namespace CoongChat.Application.Features.Users.Queries
{
    public class GetUsersQuery : GetUsersFilter, IRequest<BaseResponse<PagedResult<UserDto>>>;
}
