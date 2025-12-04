using N.Model.Entities;
using N.Service.DepartmentService.Dto;
using N.Service.Common;
using N.Service.Common.Service;
using N.Service.DepartmentService.Request;
using N.Service.Dto;

namespace N.Service.DepartmentService
{
    public interface IDepartmentService : IService<Department>
    {
        Task<PagedList<DepartmentDto>> GetData(DepartmentSearch search);

        Task<DepartmentDto> GetDto(Guid id);

        List<DepartmentHierarchy> GetDepartmentHierarchy();

        Task<DepartmentDto> GetDetail(Guid id);

        Task<List<DropdownOption>> GetDropDown(string? selected);

        Task<List<DropdownOption>> GetDropRolesInDepartment(Guid? departmentId, Guid? userId);

        Task<List<DropdownOptionTree>> GetDropdownTreeOption(bool disabledParent = true);

        List<DepartmentVM> BuildDepartmentHierarchy();

        Task<List<DepartmentExport>> GetDepartmentExportData(string type);
        List<Guid> GetChildIds(List<Guid> ids);
        Task<List<DropdownOptionTree>> GetDropdownTreeOptionByUserDepartment(bool disabledParent = true, Guid? donViId = null);
        Task<List<DropdownOptionTree>> GetSubAndCurrentUnitDropdownTreeByUserDepartment(bool disabledParent = true, Guid? donViId = null);
  
        Task<List<DropdownOption>> GetDropdownDonViId(Guid? IdDepartment);
    }
}