namespace Saba.Api.Models.Account
{
    public class UserRegisterResponse
    {
        public UserRegisterResponse(string token)
        {
            Token = token;
        }

        public string Token { get; set; }
    }
}
