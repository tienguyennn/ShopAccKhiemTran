using N.Model.Entities;
using N.Service.AppUserService.Dto;
using N.Service.AppUserService.Request;
using N.Service.Common;
using N.Service.Common.Service;

namespace N.Service.AppUserService
{
    public interface IAppUserService : IService<AppUser>
    {
        Task<LoginResponseDto> LoginUser(string email, string password);

        Task<string> ResetPassword(string email, string baseUri);

        Task<AppUserDto> ChangePassword(Guid? id, string oldPassword, string newPassword, string confirmPassword);

        Task<LoginResponseDto> RefreshToken(string refreshToken);

        Task<AppUserDto> CheckLogin(Guid? id);


        Task<AppUser?> GetByUserName(string UserName);

        Task<AppUserDto> GetInfo(Guid? id);
        Task<AppUserDto> GetDto(Guid? id);

        Task<AppUserDto> RegisterUser(RegisterViewModel model);


        Task<PagedList<AppUserDto>> GetData(AppUserSearch search, AppUserDto userDto = null);

        Task<List<AppUser>> GetUserByCanBoIds(List<Guid> canboIds);

        Task<AppUser> GetUserByCanBoId(Guid? canboId);
    }
}