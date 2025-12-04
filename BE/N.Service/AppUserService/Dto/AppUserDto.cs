using N.Model.Entities;
using N.Service.OperationService.Dto;
using System.ComponentModel;

namespace N.Service.AppUserService.Dto
{
    public class AppUserDto
    {

        public Guid? Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public int Gender { get; set; }
        public string? Picture { get; set; }
        public List<string> ListRole { get; set; }
        public Guid? DonViId { get; set; }
        public bool? IsSSO { get; set; }
        public bool? isHasRole { get; set; }
        public string? AnhDaiDien { get; set; }
        public string? TenDonVi_txt { get; set; }
        public Guid IdJoin { get; set; }
        public string? Type { get; set; }

        public string? UserName { get; set; }
        public string? DiaChi { get; set; }
        public string? Tinh { get; set; }
        public string? Huyen { get; set; }
        public string? CCCD { get; set; }

        public string? PhoneNumber { get; set; }

        public DateTime? NgaySinh { get; set; }
        [DisplayName("Giới tính")]
        public string? GioiTinh_txt { get; set; }
        public string? VaiTro_response { get; set; }
        public List<string>? VaiTro_txt_response { get; set; }

        public string? GroupRole_txt { get; set; }
        public string? Department_txt { get; set; }

        public List<Guid>? NhomNguoi { get; set; }
        public List<string>? NhomNguoi_txt { get; set; }
        public bool LockoutEnabled { get; set; }
        public string DepartmentId { get; set; }
        public List<string> GroupRole_response { get; set; }
        public List<string> ListPhongBan { get; set; }
        public List<string> vaiTro { get; set; }
        public List<MenuDataDto>? MenuData { get; set; }


        public static AppUserDto FromAppUser(AppUser? user)
        {
            if (user == null)
            {
                return new AppUserDto();
            }
            return new AppUserDto()
            {
                Gender = user.Gender,
                Id = user.Id,
                Email = user.Email,
                Name = user.Name ?? "",
                Type = user.Type,
                Picture = user.Picture,
                DonViId = user.DonViId,
                IdJoin = user.Id,
                CCCD = user.CCCD,
                UserName = user.UserName,
                DiaChi = user.DiaChi,
                PhoneNumber = user.PhoneNumber,
                NgaySinh = user.NgaySinh,
            };
        }
    }
}
