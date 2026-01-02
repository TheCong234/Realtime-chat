using FluentValidation;

namespace CoongChat.Application.Features.Messages.Commands.SendMessageToMultipleUsers
{
    public class SendMessageToMultipleUsersCommandValidator : AbstractValidator<SendMessageToMultipleUsersCommand>
    {
        public SendMessageToMultipleUsersCommandValidator()
        {
            RuleFor(x => x.UserIds)
                .NotEmpty().WithMessage("Danh sách người nhận không được để trống")
                .Must(list => list != null && list.Count > 0).WithMessage("Phải có ít nhất 1 người nhận");

            RuleFor(x => x.UserIds)
                .Must((command, userIds) => userIds == null || !userIds.Contains(command.CurrentUserId))
                .WithMessage("Không thể gửi tin nhắn cho chính mình");

            RuleFor(x => x.UserIds)
                .Must(userIds => userIds == null || userIds.Distinct().Count() == userIds.Count)
                .WithMessage("Danh sách người nhận không được chứa ID trùng lặp");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Nội dung tin nhắn không được để trống")
                .MaximumLength(5000).WithMessage("Nội dung tin nhắn không được vượt quá 5000 ký tự");

            RuleFor(x => x.Type)
                .IsInEnum().WithMessage("Loại tin nhắn không hợp lệ");
        }
    }
}
