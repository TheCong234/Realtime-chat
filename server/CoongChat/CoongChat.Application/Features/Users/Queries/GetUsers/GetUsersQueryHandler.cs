using AutoMapper;
using CoongChat.Application.Features.Users.DTOs;
using CoongChat.Application.Interfaces;
using MediatR;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    private readonly IUserRepository _repo;
    private readonly IMapper _mapper;

    public GetUsersQueryHandler(IUserRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<List<UserDto>> Handle(GetUsersQuery request, CancellationToken ct)
    {
        var users = await _repo.GetAllAsync();
        return _mapper.Map<List<UserDto>>(users);
    }
}
