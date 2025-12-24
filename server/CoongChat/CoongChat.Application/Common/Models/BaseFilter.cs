namespace CoongChat.Application.Common.Models
{
    public class BaseFilter
    {
        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }

        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public string? SortBy { get; set; }
        public bool IsDescending { get; set; } = false;
    }
}
