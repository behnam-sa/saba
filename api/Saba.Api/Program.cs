using Microsoft.EntityFrameworkCore;
using Saba.Api.Configuration;
using Saba.Api.DependencyInjection;
using Saba.Data.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Host.ConfigureAppConfiguration(configurationBuilder =>
{
    configurationBuilder.AddJsonFile("secrets.json",
        optional: false,
        reloadOnChange: true);
});

// Add services to the container.
builder.Services.Configure<AuthenticationConfig>(builder.Configuration.GetSection(nameof(AuthenticationConfig)));

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SabaDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy",
            builder => builder.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader());
    });
}

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
    app.UseCors("CorsPolicy");
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
