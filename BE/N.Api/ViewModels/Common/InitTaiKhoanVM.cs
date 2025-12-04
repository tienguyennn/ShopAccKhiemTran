namespace N.Api.Request.Common
{
    public class InitTaiKhoanVM
    {
        public List<Guid> DonViIds { get; set; }
        public List<string> CapDanhGiaCodes { get; set; }
        public List<string> RoleCodes { get; set; }
    }
}
