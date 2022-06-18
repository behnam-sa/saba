using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Saba.Api.Models.Exam;
using Saba.Api.Models.Option;
using Saba.Api.Models.Question;
using Saba.Data.Models;
using Saba.Data.Persistence;

namespace Saba.Api.Controllers
{
    [Route("course/{courseId:int}/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly SabaDbContext _context;

        public ExamController(SabaDbContext context)
        {
            _context = context;
        }

        // GET: api/Exam
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamInfo>>> GetExam(int courseId)
        {
            var course = await _context.Courses.Include(c => c.Exams).SingleOrDefaultAsync(c => c.Id == courseId);

            if (course == null)
            {
                return NotFound();
            }

            return course.Exams.OrderBy(e => e.Order)
                .Select(e => new ExamInfo()
                {
                    Id = e.Id,
                    Name = e.Name,
                    CreationDate = e.CreationDate,
                }).ToList();
        }

        // GET: api/Exam/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ExamDetails>> GetExam(int courseId, int id)
        {
            var exam = await _context.Courses
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Select(e => new ExamDetails
                {
                    Id = e.Id,
                    Name = e.Name,
                    CreationDate = e.CreationDate,
                    Questions = e.Questions.Select(q => new QuestionInfo
                    {
                        Id = q.Id,
                        Text = q.Text,
                        Options = q.Options.Select(o => new OptionInfo
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
        public async Task<IActionResult> PutExam(int courseId, int id, ExamInfoEdit examEdit)
        {
            var exam = await _context.Courses
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .SingleOrDefaultAsync(e => e.Id == id);

            if (exam is null)
            {
                return NotFound();
            }

            exam.Name = examEdit.Name;
            _context.Entry(exam).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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
        public async Task<ActionResult<ExamInfo>> PostExam(int courseId, ExamInfoCreate examInfo)
        {
            var course = await _context.Courses.Include(c => c.Exams).SingleOrDefaultAsync(c => c.Id == courseId);

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
            await _context.SaveChangesAsync();

            ExamInfo createdExam = new ExamInfo { Id = exam.Id, Name = exam.Name, CreationDate = exam.CreationDate };
            return base.CreatedAtAction("GetExam", new { courseId, id = exam.Id }, createdExam);
        }

        // DELETE: api/Exam/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteExam(int courseId, int id)
        {
            var exam = await _context.Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Attempts)
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .SingleOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                return NotFound();
            }

            _context.Entry(exam).State = EntityState.Deleted;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("reorder")]
        public async Task<IActionResult> ReorderExam(int courseId, ExamOrders orders)
        {
            var course = await _context.Courses.Include(c => c.Exams).SingleOrDefaultAsync(c => c.Id == courseId);

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
                _context.Entry(exam).State = EntityState.Modified;
            }
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> ExamExists(int courseId, int id)
        {
            return await _context.Courses
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .AnyAsync(e => e.Id == id);
        }
    }
}
