using Saba.Api.Models.Question;

namespace Saba.Api.Models.Attempt
{
    public class AttemptAnswer : QuestionInfo
    {
        public int? SelectedOption { get; set; }
    }
}