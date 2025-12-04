using N.Service.Common;
using N.Service.Dto;

namespace N.Service.RoleOperationService.Request
{
    public class RoleOperationSearch : SearchBase
    {
        public string? CreatedId {get; set; }
		public string? UpdatedId {get; set; }
		public int RoleId {get; set; }
		public int IsAccess {get; set; }
		public long OperationId {get; set; }
    }
}
