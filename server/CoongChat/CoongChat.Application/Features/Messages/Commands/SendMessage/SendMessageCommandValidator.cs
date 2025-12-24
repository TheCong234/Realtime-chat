using CoongChat.Domain.Common;
using FluentValidation;

namespace CoongChat.Application.Features.Messages.Commands.SendMessage
{
    public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
    {
        public SendMessageCommandValidator()
        {

            RuleFor(x => x.ConversationId)
                .NotEmpty().WithMessage("ConversationId là bắt buộc.");


            RuleFor(x => x.Content)
                .NotEmpty().When(x => x.Type == MessageType.Text)
                .WithMessage("Nội dung là bắt buộc cho tin nhắn văn bản.");
        }
    }
}
