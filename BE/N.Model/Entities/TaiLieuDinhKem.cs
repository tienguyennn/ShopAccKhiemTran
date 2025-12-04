using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace N.Model.Entities
{
    [Table("TaiLieuDinhKem")]
    public class TaiLieuDinhKem : AuditableEntity
    {
        public long? KichThuoc { get; set; }
        [Required]
        [StringLength(500)]
        public string TenTaiLieu { get; set; } = "";
        [StringLength(250)]
        public string? ItemType { get; set; } = "";
        public Guid? ItemId { get; set; }
        public string Path { get; set; } = "";

        public string PdfPath { get; set; } = "";

        [StringLength(250)]
        public string Extension { get; set; } = "";
        public Guid? UserId { get; set; }

    }
}
