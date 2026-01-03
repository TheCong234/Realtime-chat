using AutoMapper;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Users.DTOs;
using CoongChat.Application.Features.Users.Queries;
using CoongChat.Application.Filters;
using CoongChat.Application.Interfaces;
using MediatR;

namespace CoongChat.Application.Features.Users.Handlers
{
    public class GetUsersQueryHandler
    : IRequestHandler<GetUsersQuery, BaseResponse<PagedResult<UserDto>>>
    {
        private readonly IUserRepository _repo;
        private readonly IMapper _mapper;

        public GetUsersQueryHandler(
            IUserRepository repo,
            IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<BaseResponse<PagedResult<UserDto>>> Handle(
            GetUsersQuery request,
            CancellationToken cancellationToken)
        {
            var data = await _repo.GetPagedAsync(
                new GetUsersFilter
                {
                    PageSize = request.PageSize,
                    PageNumber = request.PageNumber,
                    Status = request.Status,
                    Search = request.Search,
                    SortBy = request.SortBy,
                    SortDirection = request.SortDirection

                },
                cancellationToken);



            return BaseResponse<PagedResult<UserDto>>.Ok(new PagedResult<UserDto>
            {
                PageNumber = data.PageNumber,
                PageSize = data.PageSize,
                TotalCount = data.TotalCount,
                Items = _mapper.Map<List<UserDto>>(data.Items)
            }, "Lây danh sách User thành công");
        }
    }
}
