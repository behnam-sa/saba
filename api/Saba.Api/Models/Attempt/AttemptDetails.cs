using Saba.Api.Models.Exam;
using System.Text.Json.Serialization;

namespace Saba.Api.Models.Attempt
{
    public class AttemptDetails : ExamInfo
    {
        public IEnumerable<AttemptAnswer>? Answers { get; set; }
    }
}
