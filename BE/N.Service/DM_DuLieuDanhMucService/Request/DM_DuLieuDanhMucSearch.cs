using N.Service.Common;
using N.Service.Dto;

namespace N.Service.DM_DuLieuDanhMucService.Request
{
    public class DM_DuLieuDanhMucSearch : SearchBase
    {
		public string? GroupId {get; set; }
		public string? Name {get; set; }
		public string? Code {get; set; }
		public string? Note {get; set; }
		public int? Priority {get; set; }
    }
}
