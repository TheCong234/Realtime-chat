using CoongChat.Application.Features.Users.Commands.CreateUser;
using FluentValidation;

public class CreateUserCommandValidator
    : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().MaximumLength(50);

        RuleFor(x => x.Email)
            .NotEmpty().EmailAddress();

        RuleFor(x => x.Password)
            .MinimumLength(6);
    }
}
