using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Saba.Api.Models.Exam;
using Saba.Api.Models.Option;
using Saba.Api.Models.Question;
using Saba.Data.Models;
using Saba.Data.Persistence;

namespace Saba.Api.Controllers
{
    [Route("Course/{courseId:int}/Exam/{examId:int}/Question/{questionId:int}/[controller]")]
    [ApiController]
    public class OptionController : ControllerBase
    {
        private readonly SabaDbContext _context;

        public OptionController(SabaDbContext context)
        {
            _context = context;
        }

        [HttpPut("{optionId:int}")]
        public async Task<IActionResult> PutOption(
            int courseId,
            int examId,
            int questionId,
            int optionId,
            QuestionInfoEdit edit
        )
        {
            var question = await _context.Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .ThenInclude(q => q.Options)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Where(c => c.Id == examId)
                .SelectMany(e => e.Questions)
                .SingleOrDefaultAsync(e => e.Id == questionId);

            var option = question?
                .Options
                .SingleOrDefault(option => option.Id == optionId);

            if (question is null || option is null)
            {
                return NotFound();
            }

            option.Text = edit.Text;
            _context.Entry(question).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await OptionExists(courseId, examId, questionId, optionId))
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
        public async Task<ActionResult<ExamInfo>> PostOption(
            int courseId,
            int examId,
            int questionId,
            OptionInfoCreate create)
        {
            var exam = await _context
                .Courses
                .Include(c => c.Exams)
                .ThenInclude(exam => exam.Questions)
                .ThenInclude(q => q.Options)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .SingleOrDefaultAsync(e => e.Id == examId);

            var question = exam?.Questions.SingleOrDefault(q => q.Id == questionId);

            if (question == null || exam == null)
            {
                return NotFound();
            }

            var option = new Option()
            {
                Text = create.Text,
                QuestionId = questionId,
                Order = question.Options.Any() ? question.Options.Max(e => e.Order) + 1 : 1,
            };

            question.Options.Add(option);
            await _context.SaveChangesAsync();

            var createdExam = new OptionInfo() { Id = option.Id, Text = option.Text };
            return Ok(createdExam);
        }

        [HttpDelete("{optionId:int}")]
        public async Task<IActionResult> DeleteOption(int courseId, int examId, int questionId, int optionId)
        {
            var exam = await _context
                .Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .ThenInclude(q => q.Options)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .SingleOrDefaultAsync(e => e.Id == examId);

            var question = exam?.Questions.SingleOrDefault(q => q.Id == questionId);
            var option = question?.Options.SingleOrDefault(o => o.Id == optionId);

            if (exam == null || question == null || option == null)
            {
                return NotFound();
            }

            _context.Entry(option).State = EntityState.Deleted;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("reorder")]
        public async Task<IActionResult> ReorderOption(int courseId, int examId, int questionId, OptionOrders orders)
        {
            var course = await _context
                .Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .ThenInclude(q => q.Options)
                .Include(c => c.Exams)
                .SingleOrDefaultAsync(c => c.Id == courseId);

            var exam = course?.Exams.SingleOrDefault(e => e.Id == examId);
            var question = exam?.Questions.SingleOrDefault(q => q.Id == questionId);

            if (course is null || exam is null || question is null)
            {
                return NotFound();
            }

            if (orders.Orders.Count != question.Options.Count)
            {
                return BadRequest();
            }

            if (orders.Orders.Values.Distinct().Count() != question.Options.Count)
            {
                return BadRequest();
            }

            foreach (var (optionId, order) in orders.Orders)
            {
                var option = question.Options.SingleOrDefault(e => e.Id == optionId);

                if (option is null)
                {
                    return BadRequest();
                }

                option.Order = order;
            }

            foreach (var option in question.Options)
            {
                _context.Entry(option).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> OptionExists(int courseId, int examId, int questionId, int optionId)
        {
            return await _context.Courses
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Where(e => e.Id == examId)
                .SelectMany(e => e.Questions)
                .Where(q => q.Id == questionId)
                .SelectMany(q => q.Options)
                .AnyAsync(e => e.Id == optionId);
        }
    }
}