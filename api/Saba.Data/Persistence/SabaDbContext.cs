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
                    builder.HasKey(x => new { x.UserId, x.CourseId });

                    builder
                    .HasOne(x => x.User)
                    .WithMany(x => x.Attendances)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.NoAction);

                    builder
                    .HasOne(x => x.Course)
                    .WithMany(x => x.Attendances)
                    .HasForeignKey(x => x.CourseId)
                    .OnDelete(DeleteBehavior.NoAction);
                });
        }
    }
}