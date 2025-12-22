namespace CoongChat.Domain.Entities
{
    public class MessageAttachment
    {
        public Guid Id { get; set; }
        public Guid MessageId { get; set; }

        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string ContentType { get; set; }
        public long FileSize { get; set; }

        public Message Message { get; set; }
    }

}
