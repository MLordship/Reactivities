using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
            .MinimumLength(6).WithMessage("Password must be at leat 6 character")
            .Matches("[A-Z]").WithMessage("Password must contain 1 uppercase letter")
            .Matches("[a-z]").WithMessage("Password must have at least 1 lowercase character")
            .Matches("[0-9]").WithMessage("Password must have at least a number")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain non alphanumeric");

            return options;
        }
    }
}