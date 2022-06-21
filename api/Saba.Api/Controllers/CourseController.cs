using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Saba.Api.Models.Course;
using Saba.Data.Models;
using Saba.Data.Persistence;

namespace Saba.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly SabaDbContext context;

        public CourseController(SabaDbContext context)
        {
            this.context = context;
        }

        // GET: api/Course
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseInfo>>> GetAll()
        {
            var courseInfos = context
                .Courses
                .Select(course => new CourseInfo
                {
                    Id = course.Id,
                    Name = course.Name,
                    Description = course.Description,
                    CreationDate = course.CreationDate,
                    CreatorName = course.Creator.DisplayName,
                });

            return await courseInfos.ToListAsync();
        }

        [HttpGet("created")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CourseInfo>>> GetCreated()
        {
            if (User.Identity?.Name is null)
            {
                return Forbid();
            }

            var courseInfos = context
                .Courses
                .Where(c => c.CreatorId == User.Identity.Name)
                .Select(course => new CourseInfo
                {
                    Id = course.Id,
                    Name = course.Name,
                    Description = course.Description,
                    CreationDate = course.CreationDate,
                    CreatorName = course.Creator.DisplayName,
                });

            return await courseInfos.ToListAsync();
        }

        [HttpGet("attended")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CourseInfo>>> GetAttended()
        {
            if (User.Identity?.Name is null)
            {
                return Forbid();
            }

            var courseInfos = context
                .Attendances
                .Where(a => a.AttendeeId == User.Identity.Name)
                .Select(a => new CourseInfo
                {
                    Id = a.Course.Id,
                    Name = a.Course.Name,
                    Description = a.Course.Description,
                    CreationDate = a.Course.CreationDate,
                    CreatorName = a.Course.Creator.DisplayName,
                });

            return await courseInfos.ToListAsync();
        }

        // GET: api/Course/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CourseDetails>> Get(int id)
        {
            var isLoggedIn = User.Identity?.Name is not null;

            var courseDetails = await context
                .Courses
                .Where(course => course.Id == id)
                .Select(course =>
                    new CourseDetails
                    {
                        Id = id,
                        Name = course.Name,
                        Description = course.Description,
                        CreationDate = course.CreationDate,
                        CreatorName = course.Creator.DisplayName,
                        IsAttended = course.Attendances.Any(x => x.AttendeeId == User.Identity!.Name),
                        IsOwner = course.CreatorId == User.Identity!.Name,
                    }
                )
                .SingleOrDefaultAsync();

            if (courseDetails is null)
            {
                return NotFound();
            }

            return courseDetails;
        }

        // PUT: api/Course/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Put([FromRoute] int id, [FromBody] CourseInfoEdit editInfo)
        {
            var course = await context.Courses.FindAsync(id);

            if (course is null)
            {
                return NotFound();
            }

            if (User.Identity is null || course.CreatorId != User.Identity.Name)
            {
                return Forbid();
            }

            course.Name = editInfo.Name;
            course.Description = editInfo.Description;

            context.Entry(course).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // POST: api/Course
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CourseInfo>> Post(CourseInfoCreate courseInfoCreate)
        {
            if (User.Identity?.Name is null)
            {
                return Forbid();
            }
            var course = new Course()
            {
                Name = courseInfoCreate.Name,
                Description = courseInfoCreate.Description,
                CreationDate = DateTime.Now,
                CreatorId = User.Identity.Name
            };

            context.Courses.Add(course);
            await context.SaveChangesAsync();

            var addedCourse = await context
                .Courses
                .Include(item => item.Creator)
                .SingleAsync(item => course.Id == item.Id);

            if (addedCourse == null)
            {
                return NotFound();
            }

            var courseInfo = new CourseInfo()
            {
                Id = course.Id,
                Name = addedCourse.Name,
                Description = addedCourse.Description,
                CreationDate = addedCourse.CreationDate,
                CreatorName = addedCourse.Creator.DisplayName
            };

            return CreatedAtAction("GetCourse", new { id = course.Id }, courseInfo);
        }

        // DELETE: api/Course/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await context
                .Courses
                .Include(c => c.Attendances)
                .SingleOrDefaultAsync(c => c.Id == id);

            if (course is null)
            {
                return NotFound();
            }

            if (User.Identity is null || course.CreatorId != User.Identity.Name)
            {
                return Forbid();
            }

            context.Courses.Remove(course);
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id:int}/attend")]
        [Authorize]
        public async Task<IActionResult> Attend(int id)
        {
            if (User.Identity?.Name is null)
            {
                return Forbid();
            }

            var course = await context
                .Courses
                .Include(x => x.Attendances)
                .SingleOrDefaultAsync(x => x.Id == id);

            if (course is null)
            {
                return NotFound();
            }

            if (course.Attendances.Any(x => x.AttendeeId == User.Identity.Name))
            {
                return BadRequest();
            }

            var attendance = new Attendance()
            {
                AttendeeId = User.Identity.Name,
                CourseId = id,
                AttendanceDate = DateTime.Now
            };

            course.Attendances.Add(attendance);
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id:int}/unattend")]
        [Authorize]
        public async Task<IActionResult> UnAttend(int id)
        {
            if (User.Identity?.Name is null)
            {
                return Forbid();
            }

            var course = await context
                .Courses
                .Include(x => x.Attendances)
                .SingleOrDefaultAsync(x => x.Id == id);

            if (course is null)
            {
                return NotFound();
            }

            var relatedRelations = course.Attendances.Where(x => x.AttendeeId == User.Identity.Name).ToList();
            if (relatedRelations.Count != 1)
            {
                return BadRequest();
            }

            var courseUser = relatedRelations[0];
            context.Entry(courseUser).State = EntityState.Deleted;
            await context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseExists(int id)
        {
            return context.Courses.Any(e => e.Id == id);
        }
    }
}