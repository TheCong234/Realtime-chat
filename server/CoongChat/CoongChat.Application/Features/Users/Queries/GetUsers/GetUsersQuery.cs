using CoongChat.Application.Features.Users.DTOs;
using MediatR;

namespace CoongChat.Application.Features.Users.Queries.GetUsers
{
    public record GetUsersQuery() : IRequest<List<UserDto>>;
}
