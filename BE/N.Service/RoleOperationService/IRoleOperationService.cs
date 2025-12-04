using N.Model.Entities;
using N.Service.RoleOperationService.Dto;
using N.Service.Common;
using N.Service.Common.Service;
using N.Service.RoleOperationService.Request;

namespace N.Service.RoleOperationService
{
    public interface IRoleOperationService : IService<RoleOperation>
    {
        Task<PagedList<RoleOperationDto>> GetData(RoleOperationSearch search);

        Task<RoleOperationDto> GetDto(Guid id);

        List<RoleOperation> GetByRoleId(Guid RoleId);

        Task<List<RoleOperationViewModel>> GetOperationByRoleId(Guid? id);
    }
}