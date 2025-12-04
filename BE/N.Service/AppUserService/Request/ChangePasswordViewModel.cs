using System.ComponentModel.DataAnnotations;

namespace N.Service.AppUserService.Request
{
    public class ChangePasswordViewModel
    {
        public string? OldPassword { get; set; }

        public string? NewPassword { get; set; }
        public string? ConfirmPassword { get; set; }
    }
}
