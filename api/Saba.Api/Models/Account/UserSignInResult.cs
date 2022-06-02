using System.Diagnostics.CodeAnalysis;

namespace Saba.Api.Models.Account
{
    public class UserSignInResult
    {
        [MemberNotNullWhen(true, nameof(Token))]
        [MemberNotNullWhen(false, nameof(ErrorMessage))]
        public bool Succeeded { get => Token is not null; }

        public string? Token { get; init; }

        public string? ErrorMessage { get; init; }
    };
}
