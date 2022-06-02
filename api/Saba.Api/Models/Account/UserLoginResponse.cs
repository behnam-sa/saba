namespace Saba.Api.Models.Account
{
    public class UserLoginResponse
    {
        public UserLoginResponse(string token)
        {
            Token = token;
        }

        public string Token { get; set; }
    }
}
