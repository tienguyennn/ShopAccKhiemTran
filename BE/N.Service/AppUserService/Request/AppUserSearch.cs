using N.Service.Common;
using N.Service.Dto;

namespace N.Service.AppUserService.Request
{
    public class AppUserSearch : SearchBase
    {

        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
        public Guid? DonViId { get; set; }
        public Guid? ParentDonViId { get; set; }
        public Guid? DepartmentId { get; set; }
        public List<string>? VaiTro { get; set; }
    }
}
