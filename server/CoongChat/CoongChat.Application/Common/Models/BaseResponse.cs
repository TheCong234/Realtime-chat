namespace CoongChat.Application.Common.Models
{
    public class BaseResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }

        public static BaseResponse Ok(string? message = null)
        {
            return new BaseResponse
            {
                Success = true,
                Message = message
            };
        }

        public static BaseResponse Fail(string message)
        {
            return new BaseResponse
            {
                Success = false,
                Message = message
            };
        }


    }

    public class BaseResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }

        public static BaseResponse<T> Ok(T data, string? message = null)
        {
            return new BaseResponse<T>
            {
                Success = true,
                Data = data,
                Message = message
            };
        }

        public static BaseResponse<T> Fail(string message)
        {
            return new BaseResponse<T>
            {
                Success = false,
                Data = default,
                Message = message
            };
        }
    }


}
