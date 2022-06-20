using Microsoft.EntityFrameworkCore;
using Saba.Api.Configuration;
using Saba.Api.DependencyInjection;
using Saba.Data.Persistence;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsProduction())
{
    builder.Host.ConfigureAppConfiguration(configurationBuilder =>
    {
        configurationBuilder.AddJsonFile("secrets.json",
            optional: false,
            reloadOnChange: true);
    });

    builder.WebHost.ConfigureLogging((hostingContext, logginBuilder) =>
    {
        logginBuilder.AddFile("Logs/Saba-{Date}.txt");
    });
}

// Add services to the container.
builder.Services.Configure<AuthenticationConfig>(builder.Configuration.GetSection(nameof(AuthenticationConfig)));
builder.Services.Configure<CorsConfig>(builder.Configuration.GetSection(nameof(CorsConfig)));

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SabaDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.ConfigureCors("CorsPolicy");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.ConfigureSwagger();
builder.Services.ConfigureAuthentication();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
