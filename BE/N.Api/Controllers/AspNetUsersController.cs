using N.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using N.Model.Entities;
using N.Service.Common;
using N.Service.Dto;
using Microsoft.AspNetCore.Identity;
using N.Service.RoleService;
using N.Service.UserRoleService;
using Microsoft.EntityFrameworkCore;
using N.Service.AppUserService.Dto;
using N.Api.Dto;
using N.Service.Constant;
using N.Service.AppUserService;
using N.Service.AppUserService.Request;

namespace N.Controllers
{
    [Route("api/[controller]")]
    public class AspNetUsersController : HinetController
    {
        private readonly IAppUserService _appUserService;
        private readonly IMapper _mapper;
        private readonly ILogger<AspNetUsersController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IRoleService _roleService;
        private readonly IUserRoleService _userRoleService;

        public AspNetUsersController(
            IAppUserService aspNetUsersService,
            IMapper mapper,
            ILogger<AspNetUsersController> logger,
            UserManager<AppUser> userManager,
            IRoleService roleService,
            IUserRoleService userRoleService
            )
        {
            _appUserService = aspNetUsersService;
            _mapper = mapper;
            _logger = logger;
            _userManager = userManager;
            _roleService = roleService;
            _userRoleService = userRoleService;
        }


        [HttpPost("Create")]
        public async Task<DataResponse<AppUser>> Create([FromBody] AspNetUsersRequest model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<AspNetUsersRequest, AppUser>(model);
                    entity.Gender = int.TryParse(model.Gender, out int dd) ? dd : 1;
                    //if (Guid.TryParse(model.DepartmentId, out var departmentId))
                    //{
                    //    entity.DonViId = departmentId;
                    //}

                    var result = await _userManager.CreateAsync(entity, model.MatKhau);

                    if (result.Succeeded)
                    {
                        return new DataResponse<AppUser>() { Data = entity, Status = true };
                    }
                    else
                    {
                        return DataResponse<AppUser>.False("Error", new string[] { "Thêm mới thất bại" });
                    }
                }
                catch (Exception ex)
                {
                    return DataResponse<AppUser>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<AppUser>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPut("Update")]
        public async Task<DataResponse<AppUser>> Update([FromBody] AspNetUsersRequest model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _appUserService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<AppUser>.False("Người dùng không tồn tại");

                    entity.Name = model.Name;
                    entity.DonViId = model.DonViId;
                    entity.PhoneNumber = model.PhoneNumber;
                    entity.NgaySinh = model.NgaySinh;
                    entity.Gender = int.TryParse(model.Gender, out int dd) ? dd : 1;
                    entity.DiaChi = model.DiaChi;
                    entity.Email = model.Email;
                    if (!string.IsNullOrEmpty(model.Type))
                    {
                        entity.Type = model.Type;
                    }

                    //if (Guid.TryParse(model.DepartmentId, out var departmentId))
                    //{
                    //    entity.DonViId = departmentId;
                    //}

                    await _appUserService.UpdateAsync(entity);

                    return new DataResponse<AppUser>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<AppUser>.False(ex.Message);
                }
            }
            return DataResponse<AppUser>.False("Dữ liệu không hợp lệ", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<AppUserDto>> Get(Guid id)
        {
            var result = await _appUserService.GetDto(id);
            return new DataResponse<AppUserDto>
            {
                Data = result,
                Message = "Get AspNetUsersDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<AppUserDto>>> GetData([FromBody] AppUserSearch search)
        {
            var userDto = new AppUserDto();
            userDto.Id = UserId ?? new Guid();
            userDto.DonViId = DonViId ?? new Guid();

            if (HasRole(RoleConstant.Admin))
            {
                userDto = null;
            }

            var result = await _appUserService.GetData(search, userDto);

            return new DataResponse<PagedList<AppUserDto>>
            {
                Data = result,
                Message = "GetData PagedList<AppUserDto> thành công",
                Status = true
            };
        }

        [HttpPost("GetListUserByRole")]
        public async Task<DataResponse<PagedList<AppUserDto>>> GetListUserByRole([FromBody] AppUserSearch search)
        {
            var userDto = new AppUserDto();
            userDto.Id = UserId ?? new Guid();
            userDto.DonViId = DonViId ?? new Guid();

            if (HasRole(RoleConstant.Admin))
            {
                userDto = null;
            }

            var result = await _appUserService.GetData(search, userDto);

            return new DataResponse<PagedList<AppUserDto>>
            {
                Data = result,
                Message = "GetData PagedList<AppUserDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _appUserService.GetByIdAsync(id);
                await _appUserService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpDelete("Lock/{id}")]
        public async Task<DataResponse> LockUser(Guid id)
        {
            var obj = await _appUserService.GetByIdAsync(id);
            if (obj == null)
            {
                return DataResponse.False("Không tìm thấy thông tin tài khoản");
            }
            try
            {
                obj.LockoutEnabled = !obj.LockoutEnabled;
                if (obj.LockoutEnabled)
                {
                    obj.LockoutEnd = DateTime.Now.AddDays(1);
                    obj.AccessFailedCount = 100;
                }
                else
                {
                    obj.LockoutEnd = null;
                    obj.AccessFailedCount = 0;
                }
                await _appUserService.UpdateAsync(obj);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Không khóa/mở khóa được tài khoản");
            }
            return DataResponse.Success(null);
        }

        [HttpGet("GetDropDown")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdown()
        {
            var thuongHieuDropdown = await _appUserService.GetQueryable().Select(x => new DropdownOption
            {
                Label = string.IsNullOrEmpty(x.Name) ? x.UserName : x.Name,
                Value = x.Id.ToString().ToLower()
            }).ToListAsync();
            return new DataResponse<List<DropdownOption>>() { Data = thuongHieuDropdown, Status = true };
        }
    }
}