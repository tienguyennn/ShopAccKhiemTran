using N.Model.Entities;
using N.Service.ModuleService.Dto;
using N.Service.Common;
using N.Service.Common.Service;
using N.Service.Dto;
using N.Service.ModuleService.Request;

namespace N.Service.ModuleService
{
    public interface IModuleService : IService<Module>
    {
        Task<PagedList<ModuleDto>> GetData(ModuleSearch search);

        Task<List<DropdownOption>> GetDropDown(string? selected);

        Task<ModuleDto> GetDto(Guid id);

        Task<List<ModuleGroup>> GetModuleGroupData(Guid roleId);
    }
}