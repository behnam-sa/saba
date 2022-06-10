using System.ComponentModel.DataAnnotations.Schema;

namespace Saba.Data.Models
{
    public class Attendance
    {
        [ForeignKey(nameof(Course))]
        public int CourseId { get; set; }

        [ForeignKey(nameof(Attendee))]
        public string AttendeeId { get; set; }

        public Course Course { get; set; }

        public User Attendee { get; set; }

        public DateTime AttendanceDate { get; set; }
    }
}
