using System.ComponentModel.DataAnnotations;

namespace Saba.Api.Models.Account
{
    public class UserInfoEdit
    {
        [Required]
        public string? Username { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Name { get; set; }

        public string? Avatar { get; set; }

        public string? NewPassword { get; set; }
    }
}
