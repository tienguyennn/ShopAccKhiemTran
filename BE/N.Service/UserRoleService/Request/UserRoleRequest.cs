
using System.ComponentModel.DataAnnotations;

namespace N.Service.UserRoleService.Request
{
    public class UserRoleRequest
    {
        public Guid? Id { get; set; }
        [Required]
		public Guid UserId {get; set; }

		public List<string>? RoleCode {get; set; }

        //[Required]
        //public Guid? DeparmentId{ get; set; }
        public List<Guid>? IdGroupRoles { get; set; }
    }

    public class UserRoleRequest_GanNguoi
    {
        [Required]
        public Guid UserId { get; set; }

        public List<Guid> ListDataRole { get; set; }
    }
}