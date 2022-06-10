using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Saba.Data.Models;

namespace Saba.Data.Persistence
{
    public class SabaDbContext : ApiAuthorizationDbContext<User>
    {
        public SabaDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {

        }

        public virtual DbSet<Course> Courses { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder
                .Entity<Attendance>(builder =>
                {
                    builder.HasKey(a => new { a.UserId, a.CourseId });

                    builder.HasOne(a => a.Course)
                        .WithMany(c => c.Attendances)
                        .OnDelete(DeleteBehavior.NoAction);
                });
        }
    }
}