using Microsoft.AspNetCore.Identity;
using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace N.Model.Entities
{
    [Table("Department")]
    public class Department : AuditableEntity
    {
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
