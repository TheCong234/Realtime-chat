using FluentValidation;

namespace CoongChat.Application.Features.Messages.Commands.RecallMessage
{
    public class RecallMessageCommandValidator : AbstractValidator<RecallMessageCommand>
    {
        public RecallMessageCommandValidator()
        {
            RuleFor(x => x.MessageId)
                .NotEmpty().WithMessage("MessageId là bắt buộc.");

            RuleFor(x => x.CurrentUserId)
                .NotEmpty().WithMessage("UserId là bắt buộc.");
        }
    }
}
