using System.Net;
using System.Text.Json;
using CoongChat.Application.Common.Exceptions;
using CoongChat.Application.Common.Models;

namespace CoongChat.API.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (UnauthorizedException ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await WriteResponse(context, ex.Message);
            }
            catch (ValidationExceptionCustom ex)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;

                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    message = "Dữ liệu không hợp lệ",
                    errors = ex.Errors
                });
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                await context.Response.WriteAsJsonAsync(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        private static async Task WriteResponse(
            HttpContext context,
            string message)
        {
            context.Response.ContentType = "application/json";

            var response = BaseResponse.Fail(message);
            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
    }
}
