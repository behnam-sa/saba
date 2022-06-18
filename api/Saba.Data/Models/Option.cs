using System.ComponentModel.DataAnnotations.Schema;

namespace Saba.Data.Models
{
    public class Option
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public int Order { get; set; }

        public virtual Question Question { get; set; }

        [ForeignKey(nameof(Question))]
        public int QuestionId { get; set; }
    }
}
