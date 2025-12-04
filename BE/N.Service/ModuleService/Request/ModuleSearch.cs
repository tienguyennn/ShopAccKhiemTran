using N.Service.Dto;


namespace N.Service.ModuleService.Request
{
    public class ModuleSearch : SearchBase
    {
		public bool? IsShow {get; set; }
		public string? Code {get; set; }
		public string? Name {get; set; }
    }
}
