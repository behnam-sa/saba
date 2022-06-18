using System.ComponentModel.DataAnnotations.Schema;

namespace Saba.Data.Models
{
    public class Answer
    {
        public int Id { get; set; }

        public int SelectedOption { get; set; }

        public virtual Attempt Attempt { get; set; }

        [ForeignKey(nameof(Attempt))]
        public int AttemptId { get; set; }

        public virtual Question Question { get; set; }

        [ForeignKey(nameof(Question))]
        public int QuestionId { get; set; }
    }
}
