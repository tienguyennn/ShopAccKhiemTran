using Microsoft.AspNetCore.Identity;
using System.ComponentModel;

namespace N.Model.Entities
{
    public class AppUser : IdentityUser<Guid>, IAuditableEntity
    {
        [DisplayName("Tên đăng nhập")]
        public string? Name { get; set; }

        [DisplayName("Giới tính")]
        public int Gender { get; set; }

        [DisplayName("Ảnh đại diện")]
        public string? Picture { get; set; }

        [DisplayName("Loại")]
        public string? Type { get; set; }

        [DisplayName("Quyền")]
        public string? Permissions { get; set; }

        [DisplayName("Mã đơn vị")]
        public Guid? DonViId { get; set; }

        [DisplayName("Ngày sinh")]
        public DateTime? NgaySinh { get; set; }

        [DisplayName("Địa chỉ")]
        public string? DiaChi { get; set; }

        [DisplayName("Cập nhật mật khẩu")]
        public bool? IsUpdateNewPass { get; set; }

        [DisplayName("SSO")]
        public bool? IsSSO { get; set; }

        [DisplayName("Cán bộ ID")]
        public Guid? CanBoId { get; set; }

        [DisplayName("GroupRole")]
        public string? GroupRole { get; set; }
        
        [DisplayName("BusinessId")]
        public Guid? BusinessId { get; set; }

        [DisplayName("CCCD")]
        public string? CCCD { get; set; }
        public DateTime CreatedDate { get ; set ; }
        public string? CreatedBy { get ; set ; }
        public Guid? CreatedId { get ; set ; }
        public DateTime UpdatedDate { get ; set ; }
        public Guid? UpdatedId { get ; set ; }
        public string? UpdatedBy { get ; set ; }
        public bool IsDeleted { get ; set ; }
        public DateTime? DeletedDate { get ; set ; }
        public Guid? DeletedId { get ; set ; }
    }
}