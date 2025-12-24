using AutoMapper;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Auth.Queries;
using CoongChat.Application.Features.Users.DTOs;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Common;
using MediatR;

namespace CoongChat.Application.Features.Auth.Handlers
{
    public class GetMyProfileQueryHandler
    : IRequestHandler<GetMyProfileQuery, BaseResponse<UserDto>>
    {
        private readonly IUserRepository _repo;
        private readonly IMapper _mapper;

        public GetMyProfileQueryHandler(IUserRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<BaseResponse<UserDto>> Handle(
            GetMyProfileQuery request,
            CancellationToken cancellationToken)
        {
            var data = await _repo.GetByIdAsync(request.userId)
                ?? throw new KeyNotFoundException("Người dùng không tồn tại");
            data.Status = UserStatus.Online;

            await _repo.UpdateAsync(data);
            var user = _mapper.Map<UserDto>(data);

            return BaseResponse<UserDto>.Ok(user, "Lấy thông tin người dùng hiện tại thành công");
        }
    }
}
