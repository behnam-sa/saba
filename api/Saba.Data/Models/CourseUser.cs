using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Saba.Data.Models
{
    public class CourseUser
    {
        [ForeignKey(nameof(Course))]
        public int CourseId { get; set; }

        [ForeignKey(nameof(User))]
        public string UserId { get; set; }

        public Course Course { get; set; }
        public User User { get; set; }
        
        public DateTime Created { get; set; }
    }
}
