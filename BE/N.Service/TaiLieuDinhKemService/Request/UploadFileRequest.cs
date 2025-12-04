using N.Model.Entities;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace N.Service.TaiLieuDinhKemService.Dto
{
    public class UploadFileRequest
    {
        [Required]
        public IFormFileCollection? Files { get; set; }
        public string? FileType { get; set; } = "";
        public Guid? ItemId { get; set; }
        public Guid? IdBuocThucHienDVC { get; set; }
        public bool? IsTemp { get; set; } = false;
    }
}
