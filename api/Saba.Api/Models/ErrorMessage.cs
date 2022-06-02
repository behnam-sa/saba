namespace Saba.Api.Models
{
    public class ErrorMessage
    {
        public ErrorMessage()
        {
            Message = "خطایی رخ داده است.";
        }

        public ErrorMessage(string message)
        {
            Message = message;
        }

        public string Message { get; set; }
    }
}
