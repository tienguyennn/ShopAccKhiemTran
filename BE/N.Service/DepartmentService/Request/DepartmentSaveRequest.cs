
using N.Model.Entities;
using System.ComponentModel.DataAnnotations;

namespace N.Service.DepartmentService.Request
{
    public class DepartmentSaveRequest 
    {
        public Guid? Id { get; set; }
        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        public string? ShortName { get; set; }
        [Required]
        [StringLength(250)]
        public string Code { get; set; }
        public Guid? ParentId { get; set; }
        public long? Priority { get; set; } = 1;
        public int Level { get; set; }
        public string Loai { get; set; }
        public bool IsActive { get; set; } = true;
        public string? DiaDanh { get; set; }

    }


}