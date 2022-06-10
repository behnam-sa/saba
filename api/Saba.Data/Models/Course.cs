using System.ComponentModel.DataAnnotations.Schema;

namespace Saba.Data.Models
{
    public class Course
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime CreationDate { get; set; }

        public virtual User Creator { get; set; }

        [ForeignKey(nameof(Creator))]
        public string CreatorId { get; set; }

        public ICollection<CourseUser> CourseUsers { get; set; }
    }
}
