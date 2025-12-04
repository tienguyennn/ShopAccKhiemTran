using N.Api.Dto;
using N.Api.Hellper;
using N.Model.Entities;
using N.Service.AppUserService;
using N.Service.AppUserService.Dto;
using N.Service.AppUserService.Request;
using N.Service.Core.Mapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace N.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : HinetController
    {
        private readonly ILogger<AccountController> _logger;
        private readonly IAppUserService _userService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMapper _mapper;

        public AccountController(
            IAppUserService AuthService,
            ILogger<AccountController> logger,
            UserManager<AppUser> userManager
,
            IWebHostEnvironment webHostEnvironment,
            IConfiguration configuration,
            IMapper mapper)
        {
            _logger = logger;
            _userService = AuthService;
            _userManager = userManager;
            _webHostEnvironment = webHostEnvironment;
            _mapper = mapper;
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<DataResponse<LoginResponseDto>> Login([FromBody] LoginViewModel model)
        {
            try
            {
                var result = await _userService.LoginUser(model.UserName, model.Password);
                return new DataResponse<LoginResponseDto>
                {
                    Data = result,
                    Message = "Đăng nhập thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        [HttpGet("GetInfo")]
        [Authorize]
        public async Task<DataResponse<AppUserDto>> GetInfo()
        {
            var result = await _userService.GetInfo(UserId);
            if (result != null && result.MenuData != null)
            {
                foreach (var item in result.MenuData)
                {
                    if (!string.IsNullOrEmpty(item.Icon))
                    {
                        item.Icon = ConvertToBase64.GetContentFile(item.Icon, _webHostEnvironment);
                    }
                }
            }

            return new DataResponse<AppUserDto>
            {
                Data = result,
                Message = "Lấy thông tin tài khoản thành công",
                Status = true
            };
        }

    }
}