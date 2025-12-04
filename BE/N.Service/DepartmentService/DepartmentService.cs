using N.Model.Entities;
using N.Service.Common.Service;
using N.Service.DepartmentService.Dto;
using N.Service.Common;
using N.Service.DepartmentService.Request;
using Microsoft.EntityFrameworkCore;
using N.Service.Constant;
using N.Service.Dto;
using N.Model;

namespace N.Service.DepartmentService
{
    public class DepartmentService : Service<Department>, IDepartmentService
    {

        public DepartmentService(
            AppDbContext context) : base(context)
        {
        }

        public async Task<PagedList<DepartmentDto>> GetData(DepartmentSearch search)
        {
            var query = from q in GetQueryable()
                        select new DepartmentDto
                        {
                            CreatedId = q.CreatedId,
                            UpdatedId = q.UpdatedId,
                            ParentId = q.ParentId,
                            Priority = q.Priority,
                            Name = q.Name,
                            Code = q.Code,
                            ShortName = q.ShortName,
                            DiaDanh = q.DiaDanh,
                            Loai = q.Loai,
                            Level = q.Level,
                            IsActive = q.IsActive,
                            IsDeleted = q.IsDeleted,
                            Id = q.Id,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            DeletedId = q.DeletedId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeletedDate = q.DeletedDate,
                        };

            if (search != null)
            {
                if (!string.IsNullOrEmpty(search.Name))
                    query = query.Where(x => x.Name.ToUpper().Contains(search.Name.Trim().ToUpper()));

                if (!string.IsNullOrEmpty(search.Code))
                    query = query.Where(x => x.Code.ToUpper().Contains(search.Code.Trim().ToUpper()));

                if (search.IsActive != null)
                    query = query.Where(x => x.IsActive == search.IsActive);

                if (search.Level != null)
                    query = query.Where(x => x.Level == search.Level);

                if (!string.IsNullOrEmpty(search.Loai))
                    query = query.Where(x => x.Loai.Equals(search.Loai));
            }

            query = query.OrderByDescending(x => x.CreatedDate);
            return await PagedList<DepartmentDto>.CreateAsync(query, search);
        }

        public async Task<DepartmentDto> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              select new DepartmentDto
                              {
                                  CreatedId = q.CreatedId,
                                  UpdatedId = q.UpdatedId,
                                  ParentId = q.ParentId,
                                  Priority = q.Priority,
                                  Name = q.Name,
                                  Code = q.Code,
                                  Loai = q.Loai,
                                  Level = q.Level,
                                  IsActive = q.IsActive,
                                  IsDeleted = q.IsDeleted,
                                  Id = q.Id,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  DeletedId = q.DeletedId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeletedDate = q.DeletedDate,
                              }).FirstOrDefaultAsync();

            return item ?? throw new Exception("Department not found");
        }

        public async Task<DepartmentDto> GetDetail(Guid id)
        {
            var currentDept = await GetByIdAsync(id) ?? throw new Exception("Department not found");

            var deptUser = new List<DepartmentUser>();
            if (currentDept.Loai.Equals(DepartmentTypeConstant.Department))
            {
                var userIds = _context.UserRole.Where(x => x.DepartmentId.Equals(id)).Select(x => x.UserId);
                deptUser = _context.Users
                    .Where(x => userIds.Contains(x.Id))
                    .Select(x => new DepartmentUser
                    {
                        Id = x.Id,
                        Name = x.Name
                    }).ToList();
            }

            return new DepartmentDto
            {
                CreatedId = currentDept.CreatedId,
                UpdatedId = currentDept.UpdatedId,
                ParentId = currentDept.ParentId,
                Priority = currentDept.Priority,
                Name = currentDept.Name,
                Code = currentDept.Code,
                Loai = currentDept.Loai,
                Level = currentDept.Level,
                IsActive = currentDept.IsActive,
                IsDeleted = currentDept.IsDeleted,
                Id = currentDept.Id,
                CreatedBy = currentDept.CreatedBy,
                UpdatedBy = currentDept.UpdatedBy,
                DeletedId = currentDept.DeletedId,
                CreatedDate = currentDept.CreatedDate,
                UpdatedDate = currentDept.UpdatedDate,
                DeletedDate = currentDept.DeletedDate,
                Users = deptUser,
            };
        }

        public List<DepartmentHierarchy> GetDepartmentHierarchy()
        {
            var departments = GetQueryable()
                .Select(d => new DepartmentHierarchy
                {
                    Id = d.Id,
                    Title = d.Name,
                    Code = d.Code,
                    ShortName = d.ShortName,
                    DiaDanh = d.DiaDanh,
                    ParentId = d.ParentId,
                    Priority = d.Priority,
                    Level = d.Level,
                    Loai = d.Loai,
                    IsActive = d.IsActive,
                })
                .OrderBy(d => d.Priority).ToList();

            var departmentHierarchy = departments
                .Where(d => d.ParentId == null)
                .Select(d => new DepartmentHierarchy
                {
                    Id = d.Id,
                    Title = d.Title,
                    Code = d.Code,
                    ParentId = d.ParentId,
                    Priority = d.Priority,
                    Level = d.Level,
                    Loai = d.Loai,
                    ShortName = d.ShortName,
                    DiaDanh = d.DiaDanh,
                    IsActive = d.IsActive,
                    Children = GetChildren(d.Id, departments)
                });

            return departmentHierarchy.ToList();
        }

        private List<DepartmentHierarchy>? GetChildren(Guid parentId, List<DepartmentHierarchy> departments)
        {
            var children = departments
                .Where(d => d.ParentId == parentId)
                .Select(d => new DepartmentHierarchy
                {
                    Id = d.Id,
                    Title = d.Title,
                    Code = d.Code,
                    ParentId = d.ParentId,
                    Priority = d.Priority,
                    Level = d.Level,
                    Loai = d.Loai,
                    IsActive = d.IsActive,
                    Children = GetChildren(d.Id, departments)
                })
                .ToList();
            return children.Any() ? children : null;
        }

        public async Task<List<DropdownOption>> GetDropDown(string? selected)
        {
            try
            {
                return await (from departmentTbl in GetQueryable()
                              select new DropdownOption
                              {
                                  Label = departmentTbl.Name,
                                  Value = departmentTbl.Code,
                                  Selected = selected != null ? selected == departmentTbl.Id.ToString() : false
                              }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve dropdown options: " + ex.Message);
            }
        }

        public async Task<List<DropdownOption>> GetDropRolesInDepartment(Guid? departmentId, Guid? userId)
        {
            try
            {
                return await (from departmentTbl in GetQueryable().Where(x => x.Id == departmentId)
                              join userRoleTbl in _context.UserRole.Where(x => x.UserId == userId)
                              on departmentTbl.Id equals userRoleTbl.DepartmentId
                              into userRoleGr
                              from userRoletData in userRoleGr.DefaultIfEmpty()
                              join roleTbl in _context.Role
                              on userRoletData.RoleId equals roleTbl.Id
                              select new DropdownOption
                              {
                                  Label = roleTbl.Name,
                                  Value = roleTbl.Code,
                              }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve roles in department: " + ex.Message);
            }
        }

        public async Task<List<DropdownOptionTree>> GetDropdownTreeOption(bool disabledParent = true)
        {
            var departments = await GetQueryable()
                .Where(x => x.IsActive).ToListAsync();

            var rootDepartments = departments.Where(d => d.ParentId == null).ToList();
            var result = new List<DropdownOptionTree>();

            foreach (var dept in rootDepartments)
            {
                result.Add(BuildTree(dept, departments, disabledParent));
            }

            return result;
        }

        public async Task<List<DropdownOptionTree>> GetDropdownTreeOptionByUserDepartment(bool disabledParent = true, Guid? donViId = null)
        {
            var result = new List<DropdownOptionTree>();

            var departments = await GetQueryable()
                .Where(x => x.IsActive).ToListAsync() ?? new List<Department>();

            List<Department>? rootDepartments;

            // nếu là admin thì lấy hết phòng ban
            if (donViId != null)
            {
                var dpName = departments.FirstOrDefault(x => x.Id == donViId)?.Name;
                result.Add(new DropdownOptionTree()
                {
                    Children = null,
                    Disabled = false,
                    Title = dpName,
                    Value = donViId.ToString(),
                });
            }
            // chỉ lấy chính phòng đó
            else
            {
                rootDepartments = departments.Where(x => x.ParentId == donViId).ToList();
                foreach (var dept in rootDepartments)
                {
                    result.Add(BuildTree(dept, departments, disabledParent));
                }

            }

            return result;
        }

        public async Task<List<DropdownOptionTree>> GetSubAndCurrentUnitDropdownTreeByUserDepartment(bool disabledParent = true, Guid? donViId = null)
        {
            var result = new List<DropdownOptionTree>();
            var departments = await GetQueryable()
                .Where(x => x.IsActive).ToListAsync() ?? new List<Department>();
            var department = departments.Where(x => x.Id == donViId).FirstOrDefault();
            result.Add(BuildTree(department, departments, disabledParent));
            return result;
        }


        private DropdownOptionTree BuildTree(Department department, List<Department> allDepartments, bool disabledParent)
        {
            var children = allDepartments.Where(d => d.ParentId == department.Id).ToList();

            return new DropdownOptionTree
            {
                Value = department.Id.ToString().ToLower(),
                Title = department.Name,
                Disabled = disabledParent && department.ParentId == null,
                Children = children.Any()
                    ? children.Select(child => BuildTree(child, allDepartments, disabledParent)).ToList()
                    : new List<DropdownOptionTree>()
            };
        }


        public List<DepartmentVM> BuildDepartmentHierarchy()
        {
            var departments = GetQueryable().ToList();
            return GetDepartmentHierarchy(departments, null);
        }

        private List<DepartmentVM> GetDepartmentHierarchy(List<Department> departments, Guid? parentId = null)
        {
            return departments
                .Where(d => d.ParentId == parentId)
                .Select(d => new DepartmentVM
                {
                    Id = d.Id,
                    Name = d.Name,
                    Code = d.Code,
                    ParentId = d.ParentId,
                    Priority = d.Priority,
                    Level = d.Level,
                    IsActive = d.IsActive,
                    DepartmentChilds = GetDepartmentHierarchy(departments, d.Id)
                })
                .ToList();
        }

        public async Task<List<DepartmentExport>> GetDepartmentExportData(string type)
        {
            var query = (from q in GetQueryable().Where(x => x.Loai.Equals(type))
                         join d in GetQueryable()
                         on q.ParentId equals d.Id into departmentGroup
                         from dept in departmentGroup.DefaultIfEmpty()
                         select new
                         {
                             Parent = dept != null ? dept.Name : "",
                             Name = q.Name,
                             Code = q.Code,
                             IsActive = q.IsActive,
                             CreatedDate = q.CreatedDate,
                         }).OrderByDescending(x => x.CreatedDate);

            var departments = await query.AsNoTracking().ToListAsync();
            return departments
                .Select((item, index) => new DepartmentExport
                {
                    STT = index + 1,
                    Name = item.Name,
                    Code = item.Code,
                    Status = item.IsActive ? "Hoạt động" : "Khoá",
                    Parent = item.Parent,
                    CreatedDate = item.CreatedDate.ToString("dd/MM/yyyy"),
                }).ToList();
        }

        public List<Guid> GetChildIds(List<Guid> ids)
        {
            var result = new List<Guid>();
            if (ids == null || !ids.Any()) return result;
            var childIds = _context.Department.Where(x => x.ParentId != null && ids.Contains(x.ParentId.Value))
            .Select(x => x.Id)
            .ToList();

            if (childIds != null && childIds.Any())
            {
                result.AddRange(childIds);
                result.AddRange(GetChildIds(childIds));
            }
            return result;
        }

        public async Task<List<DropdownOption>> GetDropdownDonViId(Guid? IdDepartment)
        {
            var query = await (from q in GetQueryable().Where(x => x.Id == IdDepartment)
                               select new DropdownOption
                               {
                                   Label = q.Name,
                                   Value = q.Id.ToString()
                               }).ToListAsync();
            return query;
        }
    }
}