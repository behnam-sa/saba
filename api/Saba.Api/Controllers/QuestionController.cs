using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Saba.Api.Models.Exam;
using Saba.Api.Models.Question;
using Saba.Data.Models;
using Saba.Data.Persistence;

namespace Saba.Api.Controllers
{
    [Route("course/{courseId:int}/Exam/{examId:int}/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly SabaDbContext _context;

        public QuestionController(SabaDbContext context)
        {
            _context = context;
        }

        [HttpPut("{questionId:int}")]
        public async Task<IActionResult> PutExam(int courseId, int examId, int questionId, QuestionInfoEdit edit)
        {
            var question = await _context.Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Where(c => c.Id == examId)
                .SelectMany(e => e.Questions)
                .SingleOrDefaultAsync(e => e.Id == questionId);

            if (question is null)
            {
                return NotFound();
            }

            question.Text = edit.Text;
            _context.Entry(question).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ExamExists(courseId, questionId))
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

        [HttpPost]
        public async Task<ActionResult<ExamInfo>> PostExam(int courseId, int examId, QuestionInfoCreate create)
        {
            var exam = await _context
                .Courses
                .Include(c => c.Exams)
                .ThenInclude(exam => exam.Questions)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .SingleOrDefaultAsync(e => e.Id == examId);

            if (exam == null)
            {
                return NotFound();
            }

            var question = new Question()
            {
                Text = create.Text,
                Order = create.Order,
                ExamId = examId,
            };

            exam.Questions.Add(question);
            await _context.SaveChangesAsync();

            var createdExam = new ExamInfo {Id = exam.Id, Name = exam.Name, CreationDate = exam.CreationDate};
            return base.CreatedAtAction("", new {courseId, id = exam.Id}, createdExam);
        }

        // DELETE: api/Exam/5
        [HttpDelete("{questionId:int}")]
        public async Task<IActionResult> DeleteExam(int courseId, int examId, int questionId)
        {
            var exam = await _context.Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .Include(c => c.Exams)
                .ThenInclude(e => e.Attempts)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .SingleOrDefaultAsync(e => e.Id == examId);

            var question = exam?.Questions.SingleOrDefault(q => q.Id == questionId);

            if (exam == null || question == null)
            {
                return NotFound();
            }

            _context.Entry(question).State = EntityState.Deleted;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("reorder")]
        public async Task<IActionResult> ReorderExam(int courseId, int examId, QuestionOrders orders)
        {
            var course = await _context
                .Courses
                .Include(c => c.Exams)
                .ThenInclude(c => c.Questions)
                .SingleOrDefaultAsync(c => c.Id == courseId);

            var exam = course?.Exams.SingleOrDefault(e => e.Id == examId);

            if (course is null || exam is null)
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

            foreach (var (questionId, order) in orders.Orders)
            {
                var question = exam.Questions.SingleOrDefault(e => e.Id == questionId);

                if (question is null)
                {
                    return BadRequest();
                }

                question.Order = order;
            }

            foreach (var q in exam.Questions)
            {
                _context.Entry(q).State = EntityState.Modified;
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