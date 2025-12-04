using N.Service.Common;
using N.Service.Dto;

namespace N.Service.OperationService.Request
{
    public class OperationSearch : SearchBase
    {
        public Guid? ModuleId {get; set; }
		public string? Name {get; set; }
		public string? URL {get; set; }
		public string? Code {get; set; }
		public bool? IsShow {get; set; }
    }
}
