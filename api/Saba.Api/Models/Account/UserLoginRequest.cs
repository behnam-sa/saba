using System.ComponentModel.DataAnnotations;

namespace Saba.Api.Models.Account
{
    public class UserLoginRequest
    {
        [Required]
        public string? Username { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}
