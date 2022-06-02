using Microsoft.Extensions.Options;
using Saba.Api.Configuration;

namespace Saba.Api.DependencyInjection
{
    public static class CorsServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureCors(this IServiceCollection services, string policyName)
        {
            var serviceProvider = services.BuildServiceProvider();
            var corsConfig = serviceProvider.GetRequiredService<IOptions<CorsConfig>>().Value;

            return services.AddCors(options =>
            {
                options.AddPolicy(policyName,
                    builder => builder.WithOrigins(corsConfig.ClientUrl).AllowAnyMethod().AllowAnyHeader());
            });
        }
    }
}
