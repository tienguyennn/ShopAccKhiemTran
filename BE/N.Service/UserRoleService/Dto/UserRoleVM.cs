using N.Service.DepartmentService.Request;


namespace N.Service.UserRoleService.Dto
{
    public class UserRoleVM
    {
        public Guid UserId { get; set; }

        public List<DepartmentVM> Departments { get; set; } = new List<DepartmentVM>();
    }
}
