using FluentValidation.Results;

namespace CoongChat.Application.Common.Exceptions
{
    public class ValidationExceptionCustom : Exception
    {
        public IDictionary<string, string[]> Errors { get; }

        public ValidationExceptionCustom()
            : base("Validation failure")
        {
            Errors = new Dictionary<string, string[]>();
        }

        public ValidationExceptionCustom(IEnumerable<ValidationFailure> failures)
            : this()
        {
            Errors = failures
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );
        }
    }
}
