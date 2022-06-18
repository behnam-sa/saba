using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Saba.Data.Models
{
    public class Attendance
    {
        [Key]
        [ForeignKey(nameof(Course))]
        public int CourseId { get; set; }

        [ForeignKey(nameof(Attendee))]
        public string AttendeeId { get; set; }

        public virtual Course Course { get; set; }

        public virtual User Attendee { get; set; }

        public DateTime AttendanceDate { get; set; }
    }
}
