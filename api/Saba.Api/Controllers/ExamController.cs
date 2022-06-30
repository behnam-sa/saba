using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Saba.Api.Models.Attempt;
using Saba.Api.Models.Exam;
using Saba.Api.Models.Option;
using Saba.Api.Models.Question;
using Saba.Data.Models;
using Saba.Data.Persistence;

namespace Saba.Api.Controllers
{
    [Route("Course/{courseId:int}/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly SabaDbContext context;

        public ExamController(SabaDbContext context)
        {
            this.context = context;
        }

        // GET: api/Exam
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamInfo>>> Get(int courseId)
        {
            var course = await context
                .Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Attempts)
                .SingleOrDefaultAsync(c => c.Id == courseId);

            if (course == null)
            {
                return NotFound();
            }

            return course.Exams
                .OrderBy(e => e.Order)
                .Select(e => new
                {
                    Exam = e,
                    Attempt = e.Attempts.Where(a => a.TakerId == User.Identity?.Name).SingleOrDefault()
                })
                .Select(r => new ExamInfo()
                {
                    Id = r.Exam.Id,
                    Name = r.Exam.Name,
                    CreationDate = r.Exam.CreationDate,
                    AttemptStatus = r.Attempt == null
                        ? AttemptStatus.NotAttempted
                        : (r.Attempt.IsFinished
                            ? AttemptStatus.Finished
                            : AttemptStatus.InProgress)
                }).ToList();
        }

        // GET: api/Exam/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ExamDetails>> Get(int courseId, int id)
        {
            var exam = await context.Courses
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Select(e => new ExamDetails
                {
                    Id = e.Id,
                    Name = e.Name,
                    CreationDate = e.CreationDate,
                    Questions = e.Questions.OrderBy(q => q.Order).Select(q => new QuestionInfo
                    {
                        Id = q.Id,
                        Text = q.Text,
                        CorrectOption = q.CorrectOption,
                        Options = q.Options.OrderBy(o => o.Order).Select(o => new OptionInfo
                        {
                            Id = o.Id,
                            Text = o.Text,
                        })
                    })
                })
                .SingleOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                return NotFound();
            }

            return exam;
        }

        // PUT: api/Exam/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int courseId, int id, ExamInfoEdit examEdit)
        {
            var exam = await context.Courses
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .SingleOrDefaultAsync(e => e.Id == id);

            if (exam is null)
            {
                return NotFound();
            }

            exam.Name = examEdit.Name;
            context.Entry(exam).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ExamExists(courseId, id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Exam
        [HttpPost]
        public async Task<ActionResult<ExamInfo>> Post(int courseId, ExamInfoCreate examInfo)
        {
            var course = await context.Courses.Include(c => c.Exams).SingleOrDefaultAsync(c => c.Id == courseId);

            if (course == null)
            {
                return NotFound();
            }

            var exam = new Exam()
            {
                CourseId = courseId,
                Name = examInfo.Name,
                CreationDate = DateTime.Now,
                Order = course.Exams.Any() ? course.Exams.Max(e => e.Order) + 1 : 1,
            };

            course.Exams.Add(exam);
            await context.SaveChangesAsync();

            var createdExam = new ExamInfo { Id = exam.Id, Name = exam.Name, CreationDate = exam.CreationDate };
            return base.CreatedAtAction("Get", new { courseId, id = exam.Id }, createdExam);
        }

        // DELETE: api/Exam/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int courseId, int id)
        {
            var exam = await context.Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Attempts)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .SingleOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                return NotFound();
            }

            context.Entry(exam).State = EntityState.Deleted;
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("reorder")]
        public async Task<IActionResult> Reorder(int courseId, ExamOrders orders)
        {
            var course = await context.Courses.Include(c => c.Exams).SingleOrDefaultAsync(c => c.Id == courseId);

            if (course is null)
            {
                return NotFound();
            }

            if (orders.Orders.Count != course.Exams.Count)
            {
                return BadRequest();
            }

            if (orders.Orders.Values.Distinct().Count() != course.Exams.Count)
            {
                return BadRequest();
            }

            foreach (var (examId, order) in orders.Orders)
            {
                var exam = course.Exams.SingleOrDefault(e => e.Id == examId);

                if (exam is null)
                {
                    return BadRequest();
                }
                exam.Order = order;
            }

            foreach (var exam in course.Exams)
            {
                context.Entry(exam).State = EntityState.Modified;
            }
            await context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> ExamExists(int courseId, int id)
        {
            return await context.Courses
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .AnyAsync(e => e.Id == id);
        }
    }
}
