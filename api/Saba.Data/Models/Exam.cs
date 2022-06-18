using System.ComponentModel.DataAnnotations.Schema;

namespace Saba.Data.Models
{
    public class Exam
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime CreationDate { get; set; }

        public int Order { get; set; }

        public Course Course { get; set; }

        [ForeignKey(nameof(Course))]
        public int CourseId { get; set; }

        public ICollection<Question> Questions { get; set; }

        public ICollection<Attempt> Attempts { get; set; }
    }
}
