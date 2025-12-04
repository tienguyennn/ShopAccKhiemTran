using N.Model.Entities;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace N.Service.TaiLieuDinhKemService.Dto
{
    public class TaiLieuDinhKemDto : TaiLieuDinhKem
    {
        public bool isXoaFile { get; set; }
        public string? GroupTxt { get; set; }
        public string? LoaiTaiLieuTxt { get; set; }
    }
}
