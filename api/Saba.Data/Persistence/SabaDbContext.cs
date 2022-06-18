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

        public virtual DbSet<Attendance> Attendances { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder
                .Entity<Attendance>(builder =>
                {
                    builder.HasKey(a => new { a.AttendeeId, a.CourseId });

                    builder.HasOne(a => a.Course)
                        .WithMany(c => c.Attendances)
                        .OnDelete(DeleteBehavior.ClientCascade);
                });

            builder
                .Entity<Attempt>(builder =>
                {
                    builder.HasOne(a => a.Exam)
                        .WithMany(e => e.Attempts)
                        .OnDelete(DeleteBehavior.ClientCascade);
                });

            builder
                .Entity<Answer>(builder =>
                {
                    builder.HasOne(a => a.Question)
                        .WithMany(q => q.Answers)
                        .OnDelete(DeleteBehavior.ClientCascade);
                });
        }
    }
}
