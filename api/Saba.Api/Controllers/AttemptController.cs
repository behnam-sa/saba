using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Saba.Api.Models.Attempt;
using Saba.Api.Models.Option;
using Saba.Data.Models;
using Saba.Data.Persistence;

namespace Saba.Api.Controllers
{
    [Route("Course/{courseId:int}/Exam/{examId:int}/[controller]")]
    [ApiController]
    public class AttemptController : ControllerBase
    {
        private readonly SabaDbContext context;

        public AttemptController(SabaDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int courseId, int examId)
        {
            if (User.Identity?.Name is null)
            {
                return Unauthorized();
            }

            var details = await context
                .Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Attempts)
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .ThenInclude(e => e.Answers)
                .Include(c => c.Exams)
                .ThenInclude(e => e.Questions)
                .ThenInclude(q => q.Options)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Where(e => e.Id == examId)
                .Select(e => new
                {
                    Exam = e,
                    Attempt = e.Attempts.SingleOrDefault(a => a.TakerId == User.Identity.Name),
                })
                .Select(r => new AttemptDetails
                {
                    Id = r.Exam.Id,
                    Name = r.Exam.Name,
                    CreationDate = r.Exam.CreationDate,
                    AttemptStatus = r.Attempt == null
                        ? AttemptStatus.NotAttempted
                        : (r.Attempt.IsFinished
                            ? AttemptStatus.Finished
                            : AttemptStatus.InProgress),
                    Answers = r.Exam.Questions
                        .OrderBy(q => q.Order)
                        .Select(q => new AttemptAnswer
                        {
                            Id = q.Id,
                            Text = q.Text,
                            Options = q.Options
                                .OrderBy(o => o.Order)
                                .Select(o => new OptionInfo
                                {
                                    Id = o.Id,
                                    Text = o.Text,
                                }),
                            SelectedOption = q.Answers.Any(a => a.Attempt.TakerId == User.Identity.Name)
                                ? q.Answers.Single(a => a.Attempt.TakerId == User.Identity.Name).SelectedOption
                                : null,
                            CorrectOption = r.Attempt != null && r.Attempt.IsFinished ? q.CorrectOption : null,
                        }),
                })
                .SingleOrDefaultAsync();

            if (details is null)
            {
                return NotFound();
            }

            return Ok(details);
        }

        [HttpPost("begin")]
        public async Task<IActionResult> Begin(int courseId, int examId)
        {
            if (User.Identity?.Name is null)
            {
                return Unauthorized();
            }

            var result = await context
                .Courses
                .Include(c => c.Exams)
                .ThenInclude(e => e.Attempts)
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Select(e => new
                {
                    Exam = e,
                    HasAttempt = e.Attempts.Any(a => a.TakerId == User.Identity.Name),
                })
                .SingleOrDefaultAsync(e => e.Exam.Id == examId);

            if (result is null)
            {
                return NotFound();
            }

            if (result.HasAttempt)
            {
                return BadRequest();
            }

            var attempt = new Attempt()
            {
                TakerId = User.Identity.Name,
            };

            result.Exam.Attempts.Add(attempt);
            await context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("finish")]
        public async Task<IActionResult> Finish(int courseId, int examId)
        {
            if (User.Identity?.Name is null)
            {
                return Unauthorized();
            }

            var result = await context
                .Courses
                .Where(c => c.Id == courseId)
                .SelectMany(c => c.Exams)
                .Select(e => new
                {
                    Exam = e,
                    Attempt = e.Attempts.SingleOrDefault(a => a.TakerId == User.Identity.Name),
                })
                .SingleOrDefaultAsync(e => e.Exam.Id == examId);

            if (result is null)
            {
                return NotFound();
            }

            if (result.Attempt is not { IsFinished: false })
            {
                return BadRequest();
            }

            result.Attempt.IsFinished = true;
            result.Attempt.FinishTime = DateTime.Now;

            context.Entry(result.Attempt).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
