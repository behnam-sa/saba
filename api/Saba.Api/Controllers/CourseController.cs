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
        private readonly SabaDbContext _context;

        public CourseController(SabaDbContext context)
        {
            _context = context;
        }

        // GET: api/Course
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseInfo>>> GetCourse()
        {
            var courseInfos = _context
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

        // GET: api/Course/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Course>> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course is null)
            {
                return NotFound();
            }

            return course;
        }

        // PUT: api/Course/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutCourse([FromRoute] int id, [FromBody] CourseInfoEdit editInfo)
        {
            var course = await _context.Courses.FindAsync(id);

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

            _context.Entry(course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse(Course course)
        {
            if (User.Identity?.Name is null)
            {
                return Forbid();
            }

            course.CreationDate = DateTime.UtcNow;
            course.CreatorId = User.Identity.Name;

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCourse", new {id = course.Id}, course);
        }

        // DELETE: api/Course/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course is null)
            {
                return NotFound();
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseExists(int id)
        {
            return _context.Courses.Any(e => e.Id == id);
        }
    }
}