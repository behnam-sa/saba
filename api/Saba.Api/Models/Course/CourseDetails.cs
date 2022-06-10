namespace Saba.Api.Models.Course
{
    public class CourseDetails
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime CreationDate { get; set; }

        public string CreatorName { get; set; }

        public bool IsAttended { get; set; }

        public bool IsOwner { get; set; }
    }
}
