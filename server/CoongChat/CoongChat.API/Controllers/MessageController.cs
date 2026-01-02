using System.Security.Claims;
using CoongChat.Application.Features.Messages.Commands.SendMessage;
using CoongChat.Application.Features.Messages.Commands.SendMessageToMultipleUsers;
using CoongChat.Application.Features.Messages.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoongChat.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MessageController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageCommand command)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            command.CurrentUserId = Guid.Parse(userIdClaim);
            var result = await _mediator.Send(command);

            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("Broadcast")]
        public async Task<IActionResult> SendMessageToMultipleUsers([FromBody] SendMessageToMultipleUsersCommand command)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            command.CurrentUserId = Guid.Parse(userIdClaim);
            var result = await _mediator.Send(command);

            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("Conversation/{id}/GetPaged")]
        public async Task<IActionResult> GetMessagesByConversationId(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest("Id không hợp lệ");
            }
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }
            var query = new GetMessagesByConversationIdQuery(id, Guid.Parse(userIdClaim));
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
