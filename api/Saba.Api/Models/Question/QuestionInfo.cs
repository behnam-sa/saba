using Saba.Api.Models.Option;

namespace Saba.Api.Models.Question
{
    public class QuestionInfo
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public IEnumerable<OptionInfo> Options { get; set; }
    }
}
