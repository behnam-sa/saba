using System.ComponentModel.DataAnnotations.Schema;

namespace Saba.Data.Models
{
    public class Attempt
    {
        public int Id { get; set; }

        public Exam Exam { get; set; }

        [ForeignKey(nameof(Exam))]
        public int ExamId { get; set; }

        public virtual User Taker { get; set; }

        [ForeignKey(nameof(Taker))]
        public string TakerId { get; set; }

        public ICollection<Answer> Answers { get; set; }

        public DateTime Time { get; set; }
    }
}
