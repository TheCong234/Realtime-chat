using CoongChat.Application.Common.Models;
using CoongChat.Domain.Common;

namespace CoongChat.Application.Filters
{
    public class GetUsersFilter : BaseFilter
    {
        public UserStatus? Status { get; set; }
    }
}
