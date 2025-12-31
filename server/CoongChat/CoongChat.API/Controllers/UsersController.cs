
using System.Security.Claims;
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Users.Commands.UpdateUserProfile;
using CoongChat.Application.Features.Users.DTOs;
using CoongChat.Application.Features.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("GetPaged")]
    public async Task<ActionResult<BaseResponse<PagedResult<UserDto>>>> GetUsersPaged(
            [FromQuery] GetUsersQuery query)
    {
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpPut("Profile")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<BaseResponse<UserDto>>> UpdateProfile(
        [FromForm] UpdateUserProfileRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(BaseResponse<UserDto>.Fail("Không xác thực được người dùng"));
        }

        var command = new UpdateUserProfileCommand(
            userId,
            request.FullName,
            request.PhoneNumber,
            request.AvatarFile);

        var result = await _mediator.Send(command);

        return Ok(result);
    }
}

public class UpdateUserProfileRequest
{
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public IFormFile? AvatarFile { get; set; }
}
