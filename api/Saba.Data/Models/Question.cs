using System.ComponentModel.DataAnnotations.Schema;

namespace Saba.Data.Models
{
    public class Question
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public int Order { get; set; }

        public ICollection<Option> Options { get; set; }

        public virtual Exam Exam { get; set; }

        [ForeignKey(nameof(Exam))]
        public int ExamId { get; set; }

        public ICollection<Answer> Answers { get; set; }
    }
}
