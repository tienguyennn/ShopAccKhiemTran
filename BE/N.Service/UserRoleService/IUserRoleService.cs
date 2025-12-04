using N.Model.Entities;
using N.Service.UserRoleService.Dto;
using N.Service.Common;
using N.Service.Common.Service;
using N.Service.Dto;
using N.Service.UserRoleService.Request;

namespace N.Service.UserRoleService
{
    public interface IUserRoleService : IService<UserRole>
    {
        Task<PagedList<UserRoleDto>> GetData(UserRoleSearch search);

        Task<UserRoleDto> GetDto(Guid id);

        UserRole GetByUserAndRole(Guid userId, Guid roleId);

        List<UserRole> GetByUser(Guid userId);

        Task<UserRoleVM> GetUserRoleVM(Guid userId);
        List<string> GetListRoleCodeByUserId(Guid userId);
    }
}