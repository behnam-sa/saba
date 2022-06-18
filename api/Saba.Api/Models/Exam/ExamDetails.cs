using Saba.Api.Models.Question;

namespace Saba.Api.Models.Exam
{
    public class ExamDetails
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime CreationDate { get; set; }

        public IEnumerable<QuestionInfo> Questions { get; set; }
    }
}
