using N.Model.Entities;
using N.Service.OperationService.Dto;

namespace N.Service.ModuleService.Dto
{
    public class ModuleDto : Module
    {
        public string TrangThaiHienThi { get; set; }
        public List<Operation> ListOperation { get; set; }
        public string? DuongDanIcon { get; set; }
    }
}
