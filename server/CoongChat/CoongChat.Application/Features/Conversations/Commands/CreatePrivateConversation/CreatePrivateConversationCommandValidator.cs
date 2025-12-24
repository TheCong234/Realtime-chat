using FluentValidation;

namespace CoongChat.Application.Features.Conversations.Commands.CreatePrivateConversation
{
    public class CreatePrivateConversationCommandValidator : AbstractValidator<CreatePrivateConversationCommand>
    {
        public CreatePrivateConversationCommandValidator()
        {
            RuleFor(x => x.TargetUserId)
                .NotEmpty().WithMessage("TargetUserId is required.")
                .NotEqual(Guid.Empty).WithMessage("TargetUserId must be a valid GUID.");
        }
    }
}
