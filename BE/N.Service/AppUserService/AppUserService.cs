using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using N.Extensions;
using N.Model;
using N.Model.Entities;
using N.Service.AppUserService.Dto;
using N.Service.AppUserService.Request;
using N.Service.Common;
using N.Service.Common.Service;
using N.Service.Core.Generator;
using N.Service.OperationService;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace N.Service.AppUserService
{
    public class AppUserService : Service<AppUser>, IAppUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IOperationService _operationService;

        public AppUserService(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IOperationService operationService,
            AppDbContext context) : base(context)

        {
            _userManager = userManager;
            _signInManager = signInManager;
            _operationService = operationService;
        }

        public async Task<AppUserDto> ChangePassword(Guid? id, string oldPassword, string newPassword, string confirmPassword)
        {
            if (string.IsNullOrEmpty(newPassword))
                throw new Exception("The password is empty");

            if (newPassword != confirmPassword)
                throw new Exception("Mật khẩu nhập lại không trùng khớp với mật khẩu mới");

            var user = await _userManager.FindByIdAsync(id.ToString()) ?? throw new Exception("Không tìm thấy tài khoản");
            if (!await _userManager.CheckPasswordAsync(user, oldPassword))
                throw new Exception("Mật khẩu cũ không chính xác");

            var data = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            if (!data.Succeeded)
                throw new Exception("Đổi mật khẩu thất bại: " + string.Join(", ", data.Errors.Select(x => x.Description)));

            return AppUserDto.FromAppUser(user);
        }

        public async Task<LoginResponseDto> LoginUser(string username, string password)
        {

            //var groupSoLanDangNhapToiDa = _dM_NhomDanhMucRepository.FindBy(x => x.GroupCode == MaDanhMucConstant.SOLANDANGNHAPTOIDA).FirstOrDefault();
            if (string.IsNullOrEmpty(password))
                throw new Exception("Tài khoản hoặc mật khẩu không chính xác");

            if (long.TryParse(password, out var number))
            {
                if (number > int.MaxValue || number < 0)
                    throw new Exception("Tài khoản hoặc mật khẩu không chính xác");
            }

            var user = await _userManager.FindByNameAsync(username) ?? throw new Exception("Tài khoản hoặc mật khẩu không chính xác");

            if (user.IsSSO == true)
            {
                //return GenToken(user);
            }


            //Lấy cấu hình
            //var groupConfig = _dM_NhomDanhMucRepository
            //    .FindBy(x => x.GroupCode == MaDanhMucConstant.SOLANDANGNHAPTOIDA)
            //    .FirstOrDefault() ?? new DM_NhomDanhMuc();

            //var soLanSaiToiDa = _dM_DuLieuDanhMucRepository
            //    .FindBy(x => x.GroupId == groupConfig.Id && x.Code == MaDanhMucConstant.SOLANDANGNHAP)
            //    .Select(x => x.Priority)
            //    .FirstOrDefault() ?? 5;

            //var thoiGianKhoa = _dM_DuLieuDanhMucRepository
            //    .FindBy(x => x.GroupId == groupConfig.Id && x.Code == MaDanhMucConstant.THOIGIANKHOA)
            //    .Select(x => x.Priority)
            //    .FirstOrDefault() ?? 1;

            //Kiểm tra xem tài khoản có bị khóa không
            if (user.LockoutEnabled && user.LockoutEnd > DateTime.Now)
            {
                throw new Exception($"{DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")}: Tài khoản đã bị khóa. Thử lại sau: {user.LockoutEnd.Value:dd/MM/yyyy HH:mm}");
            }
            else if (user.LockoutEnabled)
            {
                user.AccessFailedCount = 0;
                user.LockoutEnabled = false;
                await _userManager.UpdateAsync(user);
            }
            // Kiểm tra mật khẩu

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, password);
            //if (!isPasswordValid)
            //{
            //    await IncrementFailedLoginAttempts(user);

            //    var failedCount = user.AccessFailedCount;
            //    if (failedCount >= soLanSaiToiDa)
            //    {
            //        user.LockoutEnabled = true;
            //        user.LockoutEnd = DateTime.Now.AddHours((double)thoiGianKhoa);
            //        await _userManager.UpdateAsync(user);
            //        throw new Exception($"Tài khoản đã bị khóa. Thử lại sau: {user.LockoutEnd.Value:dd/MM/yyyy HH:mm}");
            //    }

            //    //throw new Exception($"Bạn đã nhập sai thông tin tài khoản {failedCount}/{soLanSaiToiDa}");

            //    throw new Exception("Tài khoản hoặc mật khẩu không chính xác");
            //}

            //await ResetFailedLoginAttempts(user);
            return GenToken(user);
        }

        public async Task<LoginResponseDto> RefreshToken(string refreshToken)
        {
            // Note: The cache-related logic is commented out in the original code, so it's omitted here.
            // If you need to reimplement it, you'll need to adjust accordingly.
            throw new NotImplementedException("Refresh token logic with cache is not implemented.");
        }

        public async Task<AppUserDto> CheckLogin(Guid? id)
        {
            var user = await this.GetByIdAsync(id) ?? throw new Exception("Can't find user");
            return AppUserDto.FromAppUser(user);
        }

        public async Task<string> ResetPassword(string email, string baseUri)
        {
            var user = await _userManager.FindByEmailAsync(email) ?? throw new Exception("There is no user with this Email address");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var password = Guid.NewGuid().ToString().Substring(0, 8);
            var data = await _userManager.ResetPasswordAsync(user, token, password);

            if (!data.Succeeded)
                throw new Exception("Password reset failed: " + data.Errors.FirstOrDefault()?.Code);

            //EmailProvider.SendMailResetPassword(user.Email, password, baseUri);
            return password;
        }



        public async Task<AppUserDto> Update(AppUser user)
        {
            var data = await _userManager.UpdateAsync(user);
            if (!data.Succeeded)
                throw new Exception("Update user failed: " + string.Join(", ", data.Errors.Select(x => x.Description)));

            return AppUserDto.FromAppUser(user);
        }

        private LoginResponseDto GenToken(AppUser? user, string? refreshToken = null)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString(), nameof(Guid)),
                new Claim(ClaimTypes.Locality, user.DonViId.ToString(), nameof(Guid)),
                new Claim(ClaimTypes.GroupSid, user.BusinessId.ToString(), nameof(Guid)),
            };

            if (!string.IsNullOrEmpty(user.Name))
                claims.Add(new Claim(ClaimTypes.Name, user.Name));
            if (!string.IsNullOrEmpty(user.Permissions))
                claims.Add(new Claim(ClaimTypes.Authentication, user.Permissions));


            var listRole = _context.UserRole.Where(x => x.UserId == user.Id)
                .Join(_context.Role,
                userRole => userRole.RoleId,
                role => role.Id,
                (userRole, role) => new { role.Code })
                .Select(x => x.Code)
                .Distinct()
                .ToList() ?? new List<string>();


            claims.Add(new Claim(ClaimTypes.Role, string.Join(",", listRole)));

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(AppSettings.AuthSetting.Key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var userTo = AppUserDto.FromAppUser(user);
            userTo.ListRole = listRole;
            userTo.IsSSO = user.IsSSO;



            return new LoginResponseDto
            {
                User = userTo,
                Token = tokenString,
                RefreshToken = refreshToken,
                Expire = token.ValidTo
            };
        }

        private string GenRefreshToken(Guid? userId)
        {
            var refreshToken = Generator.Base64FromBytes(64);
            // Cache logic is commented out in the original code, so it's omitted here.
            return refreshToken;
        }

        public Task<AppUser?> GetByUserName(string UserName)
        {
            return _userManager.FindByNameAsync(UserName);
        }

        public async Task<AppUserDto> GetInfo(Guid? id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString()) ?? throw new Exception("Không tìm thấy thông tin người dùng");
            var userInfor = AppUserDto.FromAppUser(user);

            var userDto = new AppUserDto
            {
                Id = id,
                Name = userInfor.Name,
                Email = userInfor.Email,
                Gender = userInfor.Gender,
                Picture = userInfor.Picture,
                DonViId = userInfor.DonViId,
                Type = userInfor.Type,
                IdJoin = user.Id,
                PhoneNumber = userInfor.PhoneNumber,
                UserName = userInfor.UserName,
                DiaChi = userInfor.DiaChi,
                NgaySinh = userInfor.NgaySinh,
                CCCD = userInfor.CCCD,
                AnhDaiDien = userInfor.AnhDaiDien
            };



            // lấy list role theo vai trò (nhóm quyền)
            var sumRole = await _context.UserRole.Where(x => x.UserId == userDto.IdJoin)
                .Join(_context.Role,
                userRole => userRole.RoleId,
                role => role.Id,
                (userRole, role) => new { role.Code })
                .Select(x => x.Code)
                .Distinct()
                .ToListAsync() ?? new List<string>();

            // gộp lại 

            userDto.ListRole = sumRole ?? new List<string>();
            userDto.MenuData = await _operationService.GetListMenu(user.Id, userDto.ListRole);
            userDto.TenDonVi_txt = _context.Department.Where(x => x.Id == userDto.DonViId).FirstOrDefault()?.Name;

            return userDto;
        }

        public async Task<AppUserDto> GetDto(Guid? id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString()) ?? throw new Exception("Không tìm thấy thông tin người dùng");

            var userDto = new AppUserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Gender = user.Gender,
                Picture = user.Picture,
                CCCD = user.CCCD,
                DiaChi = user.DiaChi,
                NgaySinh = user.NgaySinh,
                Type = user.Type,
                TenDonVi_txt = _context.Department.Where(x => x.Id == user.DonViId).FirstOrDefault()?.Name
            };
            return userDto;
        }

        public async Task<AppUserDto> RegisterUser(RegisterViewModel model)
        {
            if (string.IsNullOrWhiteSpace(model.UserName) || string.IsNullOrWhiteSpace(model.Password))
                throw new Exception("Tên đăng nhập và mật khẩu không được để trống");

            var existingUser = await _userManager.FindByNameAsync(model.UserName);
            if (existingUser != null)
                throw new Exception("Tài khoản đã tồn tại");

            var existingEmail = await _userManager.FindByEmailAsync(model.Email);
            if (existingEmail != null)
                throw new Exception("Email đã tồn tại");

            var user = new AppUser
            {
                UserName = model.UserName,
                Email = model.Email,
            };

            var createResult = await _userManager.CreateAsync(user, model.Password);
            if (!createResult.Succeeded)
                throw new Exception("Đăng ký thất bại: " + string.Join(", ", createResult.Errors.Select(e => e.Description)));

            return AppUserDto.FromAppUser(user);
        }
        private async Task IncrementFailedLoginAttempts(AppUser user)
        {
            user.AccessFailedCount++;
            await _userManager.UpdateAsync(user);

        }

        private async Task ResetFailedLoginAttempts(AppUser user)
        {
            user.AccessFailedCount = 0;
            user.LockoutEnd = null;
            user.LockoutEnabled = false;
            await _userManager.UpdateAsync(user);
        }



        public async Task<PagedList<AppUserDto>> GetData(AppUserSearch search, AppUserDto userDto = null)
        {
            // lấy các phòng con
            //var deparmentIds = userDto != null ? 
            //    await _context.Department
            //        .Where(x => x.ParentId == userDto.DonViId)
            //        .Select(x => x.ItemId)
            //        .ToListAsync() : new List<Guid>();

            //var lstIds = new List<Guid>();
            //if (userDto != null && userDto.DonViId != null)
            //{
            //    lstIds.Add(userDto.DonViId ?? new Guid());
            //}

            //var deparmentIds = _departmentService.GetChildIds(lstIds);

            try
            {
                var query = from user in GetQueryable()

                            select new AppUserDto
                            {
                                LockoutEnabled = user.LockoutEnabled,
                                Name = user.Name,
                                Gender = user.Gender,
                                Picture = user.Picture,
                                UserName = user.UserName,
                                PhoneNumber = user.PhoneNumber,
                                Email = user.Email,
                                Id = user.Id,
                                DiaChi = user.DiaChi,
                                DonViId = user.DonViId,
                                NgaySinh = user.NgaySinh,
                                Type = user.Type,
                                GioiTinh_txt = user.Gender == 1 ? "Nam" : "Nữ",
                                GroupRole_txt = user.GroupRole,
                            };

                //if (userDto != null)
                //{
                //        query = query.Where(x => x.DonViId != null && deparmentIds.Contains((Guid)x.DonViId));
                //}

                //if (userDto != null && userDto.DonViId != Guid.Empty)
                //{
                //    query = query.Where(x => x.DonViId != null && x.DonViId == userDto.DonViId);
                //    query = query.Where(x => x.ItemId != userDto.ItemId);
                //}

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.Email))
                        query = query.Where(x => !string.IsNullOrEmpty(x.Email) && x.Email.Contains(search.Email));

                    if (!string.IsNullOrEmpty(search.Name))
                        query = query.Where(x => !string.IsNullOrEmpty(x.Name) && x.Name.Contains(search.Name));

                    if (!string.IsNullOrEmpty(search.UserName))
                        query = query.Where(x => !string.IsNullOrEmpty(x.UserName) && x.UserName.Contains(search.UserName));

                    if (!string.IsNullOrEmpty(search.DiaChi))
                        query = query.Where(x => !string.IsNullOrEmpty(x.DiaChi) && x.DiaChi.Contains(search.DiaChi));

                    if (search.DonViId != null && search.ParentDonViId == null)
                        query = query.Where(x => x.DonViId == search.DonViId);

                    if (search.VaiTro != null && search.VaiTro.Any())
                    {
                        var lstRole = _context.Role.Where(x => search.VaiTro.Contains(x.Code)).Select(x => x.Id).ToList();
                        var listUserId = _context.UserRole.Where(x => lstRole.Contains(x.RoleId)).Select(x => x.UserId).ToList();
                        query = query.Where(x => x.Id.HasValue && listUserId.Contains(x.Id.Value));
                    }

                    if (!string.IsNullOrEmpty(search.Type))
                    {
                        query = query.Where(x => x.Type == search.Type);
                    }

                    if (search.DepartmentId != null)
                    {
                        query = query.Where(x => x.DonViId == search.DepartmentId);
                    }
                }

                query = query.OrderByDescending(x => x.Id);
                var result = await PagedList<AppUserDto>.CreateAsync(query, search);

              

                foreach (var item in result.Items)
                {
                    var listRoleId = _context.UserRole.Where(x => x.UserId == item.Id).Select(x => x.RoleId).ToList();
                    var listDepartmentId = _context.UserRole.Where(x => x.UserId == item.Id).Select(x => x.DepartmentId).ToList();

                    var lstRole = _context.Role.Where(x => listRoleId.Contains(x.Id)).ToList();
                    var listRoleCode = lstRole.Select(x => x.Code).ToList();
                    item.VaiTro_response = string.Join(",", listRoleCode);
                    item.VaiTro_txt_response = lstRole.Select(x => x.Name).ToList();
                    item.vaiTro = lstRole.Select(x => x.Code).ToList();

                    //var lstDept = _context.Department.Where(x => listDepartmentId.Contains(x.ItemId)).ToList();
                    var lstDept = _context.Department.Where(x => x.Id == item.DonViId).ToList();
                    item.ListPhongBan = lstDept.Select(x => x.Code).ToList();

                    item.GroupRole_response = !string.IsNullOrEmpty(item.GroupRole_txt) ? item.GroupRole_txt.Split(',').ToList() : new List<string>();

                    item.DepartmentId = lstDept.FirstOrDefault()?.Id.ToString() ?? string.Empty;
                    item.Department_txt = lstDept.FirstOrDefault()?.Name ?? string.Empty;

                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve user data: " + ex.Message);
            }
        }


        public async Task<List<AppUser>> GetUserByCanBoIds(List<Guid> canboIds)
        {
            try
            {
                return await GetQueryable().Where(x => x.CanBoId != null && canboIds.Contains(x.CanBoId.Value)).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve users by CanBo IDs: " + ex.Message);
            }
        }

        public async Task<AppUser> GetUserByCanBoId(Guid? canboId)
        {
            try
            {
                return await GetQueryable().FirstOrDefaultAsync(x => x.CanBoId != null && x.CanBoId.Equals(canboId))
                    ?? throw new Exception("User not found for CanBo ID: " + canboId);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve user by CanBo ID: " + ex.Message);
            }
        }


    }
}