using Microsoft.AspNetCore.Identity;

namespace Saba.Data.Models
{
    public class User : IdentityUser
    {
        [PersonalData]
        public string DisplayName { get; set; } = string.Empty;

        [PersonalData]
        public DateTime? RegistrationDate { get; set; }

        [PersonalData]
        public string? Avatar { get; set; }

        [PersonalData]
        public ICollection<Attendance> Attendances { get; set; }
    }
}
