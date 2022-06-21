using Saba.Api.Models.Attempt;
using System.Text.Json.Serialization;

namespace Saba.Api.Models.Exam
{
    public class ExamInfo
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime CreationDate { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public AttemptStatus AttemptStatus { get; set; }
    }
}
