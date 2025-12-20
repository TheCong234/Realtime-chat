using CoongChat.Application.Common.Models;
using CoongChat.Application.Features.Auth.Commands;
using CoongChat.Application.Features.Auth.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoongChat.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<AuthDto>>> Register(
            [FromBody] RegisterRequest request)
        {
            var result = await _mediator.Send(
                new RegisterUserCommand(
                    request.Username,
                    request.Email,
                    request.Password
                )
            );

            return Ok(result);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<BaseResponse<AuthDto>>> Login(
            [FromBody] LoginRequest request)
        {
            var result = await _mediator.Send(
                new LoginCommand(
                    request.UsernameOrEmail,
                    request.Password
                )
            );

            return Ok(result);
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> Refresh(
            [FromBody] RefreshTokenRequest request)
        {
            var result = await _mediator.Send(
                new RefreshTokenCommand(request.RefreshToken)
            );

            return Ok(result);
        }


        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            var userId = User.FindFirst("sub")?.Value
                         ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var username = User.Identity?.Name;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            return Ok(new
            {
                userId,
                username,
                role
            });
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminOnly()
        {
            return Ok("You are Admin");
        }
    };





}
