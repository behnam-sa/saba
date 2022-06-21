using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Saba.Data.Models;
using Saba.Data.Persistence;

namespace Saba.Api.Controllers
{
    [Route("Course/{courseId:int}/Exam/{examId:int}/Attempt/Question/{questionId:int}/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly SabaDbContext context;

        public AnswerController(SabaDbContext context)
        {
            this.context = context;
        }

        [HttpPut]
        public async Task<IActionResult> Put(int courseId, int examId, int questionId, [FromBody] int selectedOption)
        {
            if (User.Identity?.Name is null)
            {
                return Unauthorized();
            }

            var result = await GetAttemptQuestionAnswer(courseId, examId, questionId);

            if (result is null || result.Question is null)
            {
                return NotFound();
            }

            if (result.Attempt is null)
            {
                return BadRequest();
            }

            if (result.Answer is not null)
            {
                result.Answer.SelectedOption = selectedOption;

                context.Entry(result.Answer).State = EntityState.Modified;
                await context.SaveChangesAsync();

                return NoContent();
            }

            var newAnswer = new Answer()
            {
                QuestionId = questionId,
                SelectedOption = selectedOption,
            };

            result.Attempt.Answers.Add(newAnswer);
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int courseId, int examId, int questionId)
        {
            if (User.Identity?.Name is null)
            {
                return Unauthorized();
            }

            var result = await GetAttemptQuestionAnswer(courseId, examId, questionId);

            if (result is null || result.Question is null)
            {
                return NotFound();
            }

            if (result.Attempt is null || result.Answer is null)
            {
                return BadRequest();
            }

            context.Entry(result.Answer).State = EntityState.Deleted;
            await context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<AttemptQuestionAnswer?> GetAttemptQuestionAnswer(int courseId, int examId, int questionId)
        {
            var result = await context
                .Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Attempts)
                .ThenInclude(a => a.Answers)
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Where(e => e.Id == examId)
                .Select(e => new
                {
                    Question = e.Questions.SingleOrDefault(q => q.Id == questionId),
                    Attempt = e.Attempts.SingleOrDefault(a => a.TakerId == User.Identity!.Name!),
                })
                .Select(r => new AttemptQuestionAnswer
                (
                    r.Attempt,
                    r.Question,
                    r.Attempt == null ? null : r.Attempt.Answers.SingleOrDefault(a => a.QuestionId == questionId)
                ))
                .SingleOrDefaultAsync();

            return result;
        }

        private record AttemptQuestionAnswer(Attempt? Attempt, Question? Question, Answer? Answer);
    }
}
