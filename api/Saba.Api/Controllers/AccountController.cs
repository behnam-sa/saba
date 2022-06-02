using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Saba.Api.Configuration;
using Saba.Api.Models;
using Saba.Api.Models.Account;
using Saba.Data.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Saba.Api.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AuthenticationConfig appConfig;
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager,
            IOptions<AuthenticationConfig> appConfig)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.appConfig = appConfig.Value;
        }

        [HttpGet()]
        [ProducesResponseType(200, Type = typeof(UserRegisterResponse))]
        [ProducesResponseType(400, Type = typeof(ErrorMessage))]
        public async Task<IActionResult> UserInfo()
        {
            var user = await userManager.GetUserAsync(User);
            return Ok(new UserInfo()
            {
                Name = user.DisplayName,
                Username = user.UserName,
                Email = user.Email,
                Avatar = user.Avatar is null ? null : user.Avatar,
                RegistraionDate = user.RegistraionDate,
            }); ;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(200, Type = typeof(UserLoginResponse))]
        [ProducesResponseType(400, Type = typeof(ErrorMessage))]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest model)
        {
            var signInResult = await SignInUser(model.Username!, model.Password!);
            if (!signInResult.Succeeded)
                return BadRequest(new ErrorMessage(signInResult.ErrorMessage));

            return Ok(new UserLoginResponse(signInResult.Token));
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [ProducesResponseType(200, Type = typeof(UserRegisterResponse))]
        [ProducesResponseType(400, Type = typeof(ErrorMessage))]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest model)
        {
            var user = new User()
            {
                DisplayName = model.Name!,
                Email = model.Email,
                UserName = model.Username,
                RegistraionDate = DateTime.Now,
            };
            var creationResult = await userManager.CreateAsync(user, model.Password);
            if (!creationResult.Succeeded)
                return IdentityError(creationResult);

            var signInResult = await SignInUser(model.Username!, model.Password!);
            if (!signInResult.Succeeded)
                return BadRequest(new ErrorMessage(signInResult.ErrorMessage));

            return Ok(new UserRegisterResponse(signInResult.Token));
        }

        [HttpPost("edit")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400, Type = typeof(ErrorMessage))]
        public async Task<IActionResult> Edit(UserInfoEdit edit)
        {
            var user = await userManager.GetUserAsync(User);

            user.DisplayName = edit.Name!;
            user.UserName = edit.Username!;
            user.Email = edit.Email!;
            user.Avatar = edit.Avatar;

            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return IdentityError(result);

            if (edit.NewPassword != null)
            {
                string token = await userManager.GeneratePasswordResetTokenAsync(user);
                result = await userManager.ResetPasswordAsync(user, token, edit.NewPassword);

                if (!result.Succeeded)
                    return IdentityError(result);
            }

            return Ok();
        }

        private IActionResult IdentityError(IdentityResult result)
        {
            return BadRequest(new ErrorMessage(string.Join("\n", result.Errors.Select(error => error.Description))));
        }

        private async Task<UserSignInResult> SignInUser(string username, string password)
        {
            var user = await userManager.FindByNameAsync(username);
            if (user is null)
                return new UserSignInResult { ErrorMessage = "نام کاربری یا رمز عبور اشتباه است." };

            var result = await signInManager.CheckPasswordSignInAsync(user, password, false);
            if (!result.Succeeded)
            {
                if (result.IsNotAllowed)
                    return new UserSignInResult { ErrorMessage = "امکان ورود برای کاربر وجود ندارد." };
                return new UserSignInResult { ErrorMessage = "نام کاربری یا رمز عبور اشتباه است." };
            }

            var tokenString = await Createtoken(user);

            return new UserSignInResult { Token = tokenString };
        }

        private async Task<string> Createtoken(User user)
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, user.Id),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var roles = await userManager.GetRolesAsync(user);
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key = Encoding.UTF8.GetBytes(appConfig.JwtSecret!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = "Issuer",
                Audience = "Audience"
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return tokenString;
        }
    }
}
