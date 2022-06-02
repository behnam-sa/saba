using System.ComponentModel.DataAnnotations;

namespace Saba.Api.Models.Account
{
    public class UserRegisterRequest
    {
        [Required]
        [MinLength(3)]
        public string? Username { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}
