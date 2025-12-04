using N.Model.Entities;
using N.Service.Common.Service;
using N.Service.RoleService.Dto;
using N.Service.Common;
using Microsoft.EntityFrameworkCore;
using N.Service.Dto;
using N.Service.RoleService.Request;
using N.Model;

namespace N.Service.RoleService
{
    public class RoleService : Service<Role>, IRoleService
    {


        public RoleService(AppDbContext context) : base(context)
        {

        }

        public async Task<PagedList<RoleDto>> GetData(RoleSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new RoleDto
                            {
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                Name = q.Name,
                                Code = q.Code,
                                CreatedBy = q.CreatedBy,
                                UpdatedBy = q.UpdatedBy,
                                DeletedId = q.DeletedId,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                DeletedDate = q.DeletedDate,
                                IsDeleted = q.IsDeleted,
                                Id = q.Id,
                                Type = q.Type,
                                IsActive = q.IsActive,
                                DepartmentId = q.DepartmentId,
                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.Code))
                        query = query.Where(x => x.Code.Contains(search.Code));
                    if (!string.IsNullOrEmpty(search.Name))
                        query = query.Where(x => x.Name.Contains(search.Name));
                    //if (search.DepartmentId != null)
                    //{
                    //    query = query.Where(x => x.DepartmentId == search.DepartmentId);
                    //}
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<RoleDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve role data: " + ex.Message);
            }
        }

        public async Task<RoleDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new RoleDto
                                  {
                                      CreatedId = q.CreatedId,
                                      UpdatedId = q.UpdatedId,
                                      Name = q.Name,
                                      Code = q.Code,
                                      CreatedBy = q.CreatedBy,
                                      UpdatedBy = q.UpdatedBy,
                                      DeletedId = q.DeletedId,
                                      CreatedDate = q.CreatedDate,
                                      UpdatedDate = q.UpdatedDate,
                                      DeletedDate = q.DeletedDate,
                                      IsDeleted = q.IsDeleted,
                                      Id = q.Id,
                                      Type = q.Type
                                  }).FirstOrDefaultAsync() ?? throw new Exception($"Role with ID {id} not found");

                return item;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve role: " + ex.Message);
            }
        }

        public async Task<List<RoleDto>> GetRole(Guid userId)
        {
            try
            {
                var query = from q in GetQueryable()
                            join userRole in _context.UserRole.Where(x => x.UserId == userId)
                            on q.Id equals userRole.RoleId into JRole
                            from roleinfo in JRole.DefaultIfEmpty()
                            select new RoleDto
                            {
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                Name = q.Name,
                                Code = q.Code,
                                CreatedBy = q.CreatedBy,
                                UpdatedBy = q.UpdatedBy,
                                DeletedId = q.DeletedId,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                DeletedDate = q.DeletedDate,
                                IsDeleted = q.IsDeleted,
                                Id = q.Id,
                                IsGanNguoi = roleinfo != null
                            };

                return query.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve roles for user: " + ex.Message);
            }
        }

        public async Task<List<DropdownOption>> GetDropDown(string? selected)
        {
            try
            {
                return await GetQueryable().Select(x => new DropdownOption
                {
                    Label = x.Name,
                    Value = x.Code,
                    Selected = selected != null && selected == x.Code
                }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve dropdown options: " + ex.Message);
            }
        }

        public async Task<List<DropdownOption>> GetDropDownByUserDepartment(string? selected, Guid? departmentId)
        {
            try
            {
                var lstData = GetQueryable();
                if (departmentId != null)
                {
                    lstData = lstData.Where(x => x.DepartmentId == departmentId);
                }
                return await lstData.Select(x => new DropdownOption
                {
                    Label = x.Name,
                    Value = x.Code,
                    Selected = selected != null && selected == x.Code
                }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve dropdown options: " + ex.Message);
            }
        }

        public async Task<List<DropdownOption>> GetDropDownIdByUserDepartment(string? selected, Guid? departmentId)
        {
            try
            {
                var lstData = GetQueryable();
                var tesdsd = lstData.ToList();
                if (departmentId != null)
                {
                    lstData = lstData.Where(x => x.DepartmentId == departmentId);
                }
                return await lstData.Select(x => new DropdownOption
                {
                    Label = x.Name,
                    Value = x.Id.ToString(),
                    Selected = selected != null && selected == x.Id.ToString()
                }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve dropdown options: " + ex.Message);
            }
        }


        public async Task<List<DropdownOption>> GetDropDownVaiTroIds(string? selected)
        {
            try
            {
                return await GetQueryable().Select(x => new DropdownOption
                {
                    Label = x.Name,
                    Value = x.Id.ToString(),
                    Selected = selected != null && selected == x.Code
                }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve dropdown options by role IDs: " + ex.Message);
            }
        }

        public Role GetByCode(string code)
        {
            return GetQueryable().Where(x => x.Code == code).FirstOrDefault() ?? throw new Exception($"Role with code {code} not found");
        }

        public async Task<List<RoleDto>> GetRolesOfUser(Guid? userId)
        {
            try
            {
                var query = from role in GetQueryable()
                            join userRole in _context.UserRole.Where(x => x.UserId == userId)
                            on role.Id equals userRole.RoleId
                            select new RoleDto
                            {
                                Id = role.Id,
                                Code = role.Code,
                                Name = role.Name,
                            };

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve roles of user: " + ex.Message);
            }
        }
    }
}