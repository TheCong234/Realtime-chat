using System.Security.Claims;
using CoongChat.Application.Features.Conversations.Commands.CreatePrivateConversation;
using CoongChat.Application.Features.Conversations.Queries.GetConversationDetails;
using CoongChat.Application.Features.Conversations.Queries.GetMyConversations;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoongChat.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class ConversationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ConversationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("Private")]
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

        [HttpGet("GetPaged")]
        public async Task<IActionResult> GetMyConversations([FromQuery] GetMyConversationsQuery query)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }
            query.CurrentUserId = Guid.Parse(userIdClaim);
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetConversationDetails(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            var query = new GetConversationDetailsQuery
            {
                ConversationId = id,
                CurrentUserId = Guid.Parse(userIdClaim)
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

    }
}
