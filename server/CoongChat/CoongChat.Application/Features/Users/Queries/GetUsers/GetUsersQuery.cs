using CoongChat.Application.Features.Users.DTOs;
using MediatR;

public record GetUsersQuery() : IRequest<List<UserDto>>;
