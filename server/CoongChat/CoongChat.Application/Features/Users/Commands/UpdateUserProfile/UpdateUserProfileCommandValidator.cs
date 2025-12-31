using FluentValidation;

namespace CoongChat.Application.Features.Users.Commands.UpdateUserProfile
{
    public class UpdateUserProfileCommandValidator : AbstractValidator<UpdateUserProfileCommand>
    {
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

        public UpdateUserProfileCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId là bắt buộc");

            RuleFor(x => x.FullName)
                .MaximumLength(200).WithMessage("Họ tên không được vượt quá 200 ký tự")
                .When(x => !string.IsNullOrEmpty(x.FullName));

            RuleFor(x => x.PhoneNumber)
                .Matches(@"^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$")
                .WithMessage("Số điện thoại không hợp lệ")
                .When(x => !string.IsNullOrEmpty(x.PhoneNumber));

            RuleFor(x => x.AvatarFile)
                .Must(file => file == null || file.Length <= MaxFileSize)
                .WithMessage("Kích thước file không được vượt quá 5MB")
                .Must(file => file == null || IsValidExtension(file.FileName))
                .WithMessage("Chỉ chấp nhận các định dạng: jpg, jpeg, png, webp");
        }

        private bool IsValidExtension(string fileName)
        {
            var extension = Path.GetExtension(fileName)?.ToLowerInvariant();
            return !string.IsNullOrEmpty(extension) && _allowedExtensions.Contains(extension);
        }
    }
}
