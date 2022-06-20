using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Saba.Api.Models.Exam;
using Saba.Api.Models.Option;
using Saba.Api.Models.Question;
using Saba.Data.Models;
using Saba.Data.Persistence;

namespace Saba.Api.Controllers
{
    [Route("Course/{courseId:int}/Exam/{examId:int}/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly SabaDbContext _context;

        public QuestionController(SabaDbContext context)
        {
            _context = context;
        }

        [HttpPut("{questionId:int}")]
        public async Task<IActionResult> PutQuestion(int courseId, int examId, int questionId, QuestionInfoEdit edit)
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
                if (!await QuestionExists(courseId, examId, questionId))
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
        public async Task<ActionResult<QuestionInfo>> PostQuestion(int courseId, int examId, QuestionInfoCreate create)
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
                ExamId = examId,
                Text = create.Text,
                Order = exam.Questions.Any() ? exam.Questions.Max(e => e.Order) + 1 : 1,
            };

            exam.Questions.Add(question);
            await _context.SaveChangesAsync();

            var createdQuestion = new QuestionInfo { Id = question.Id, Text = question.Text, Options = Enumerable.Empty<OptionInfo>() };
            return createdQuestion;
        }

        // DELETE: api/Exam/5
        [HttpDelete("{questionId:int}")]
        public async Task<IActionResult> DeleteQuestion(int courseId, int examId, int questionId)
        {
            var exam = await _context.Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .ThenInclude(q => q.Answers)
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
        public async Task<IActionResult> ReorderQuestion(int courseId, int examId, QuestionOrders orders)
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

            if (orders.Orders.Count != exam.Questions.Count)
            {
                return BadRequest();
            }

            if (orders.Orders.Values.Distinct().Count() != exam.Questions.Count)
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

        private async Task<bool> QuestionExists(int courseId, int examId, int questionId)
        {
            return await _context.Courses
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Where(e => e.Id == examId)
                .SelectMany(e => e.Questions)
                .AnyAsync(e => e.Id == questionId);
        }
    }
}