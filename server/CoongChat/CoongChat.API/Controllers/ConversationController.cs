using System.Security.Claims;
using CoongChat.Application.Features.Conversations.Commands.CreatePrivateConversation;
using CoongChat.Application.Features.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoongChat.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ConversationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ConversationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("private")]
        public async Task<IActionResult> CreatePrivateConversation([FromBody] CreatePrivateConversationCommand command)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            command.CurrentUserId = Guid.Parse(userIdClaim);
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("Conversations")]
        public async Task<IActionResult> GetMyConversations([FromQuery] GetUsersQuery query)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
