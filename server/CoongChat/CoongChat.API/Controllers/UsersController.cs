
using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Users.DTOs;
using CoongChat.Application.Features.Users.Queries;
using MediatR;
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
}
