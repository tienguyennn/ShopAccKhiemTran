using N.Extensions;
using N.Model.Entities;
using N.Service.Common;
using N.Service.Common.Service;
using N.Service.Constant;
using N.Service.DM_DuLieuDanhMucService.Dto;
using N.Service.DM_DuLieuDanhMucService.Request;
using N.Service.Dto;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using N.Model;

namespace N.Service.DM_DuLieuDanhMucService
{
    public class DM_DuLieuDanhMucService : Service<DM_DuLieuDanhMuc>, IDM_DuLieuDanhMucService
    {
        public DM_DuLieuDanhMucService(
            AppDbContext context) : base(context)
        {
        }


        public async Task<N.Service.Dto.FileSetting> GetObjectSettting()
        {
            var query = await (from dmtbl in _context.DM_NhomDanhMuc
                               where dmtbl.GroupCode == FileSettingConstant.FileSetting

                               join dltbl in _context.DM_DuLieuDanhMuc on dmtbl.Id equals dltbl.Id

                               select new
                               {
                                   code = dltbl.Code,
                                   value = dltbl.Note
                               }).ToListAsync();


            var cfgSetting = new N.Service.Dto.FileSetting { };


            cfgSetting.MaxSize = query.FirstOrDefault(t => t.code == FileSettingConstant.MaxSize)?.value != null
                ? (int.TryParse(query.FirstOrDefault(t => t.code == FileSettingConstant.MaxSize)?.value, out int vl) ? vl : AppSettings.FileSetting.MaxSize) : AppSettings.FileSetting.MaxSize;

            cfgSetting.AllowExtensions = query.FirstOrDefault(t => t.code == FileSettingConstant.AllowExtensions) != null ?
                query.FirstOrDefault(t => t.code == FileSettingConstant.AllowExtensions).value : string.Join(",", AppSettings.FileSetting.AllowExtensions);

            return cfgSetting;


        }


        public async Task<List<DM_DuLieuDanhMucDto>> GetByGroupCode(string groupCode)
        {
            var query = await (from dltbl in _context.DM_NhomDanhMuc.Where(x => x.GroupCode == groupCode)

                               join dmdl in _context.DM_DuLieuDanhMuc on dltbl.Id equals dmdl.GroupId

                               select new DM_DuLieuDanhMucDto
                               {
                                   Name = dmdl.Name,
                                   Code = dmdl.Code,
                               }).ToListAsync();
            return query;
        }


        public async Task<PagedList<DM_DuLieuDanhMucDto>> GetData(DM_DuLieuDanhMucSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            join donvi in _context.Department
                            on q.DonViId equals donvi.Id into jDonVi
                            from dv in jDonVi.DefaultIfEmpty()
                            select new DM_DuLieuDanhMucDto
                            {
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                GroupId = q.GroupId,
                                Name = q.Name,
                                Code = q.Code,
                                Note = q.Note,
                                Priority = q.Priority,
                                DonViId = q.DonViId,
                                DuongDanFile = q.DuongDanFile,
                                NoiDung = q.NoiDung,
                                IsDeleted = q.IsDeleted,
                                Id = q.Id,
                                CreatedBy = q.CreatedBy,
                                UpdatedBy = q.UpdatedBy,
                                DeletedId = q.DeletedId,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                DeletedDate = q.DeletedDate,
                                TenDonVi = dv.Name
                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.GroupId) && Guid.TryParse(search.GroupId, out var groupIdValue))
                        query = query.Where(x => x.GroupId == groupIdValue);

                    if (!string.IsNullOrEmpty(search.Name))
                        query = query.Where(x => x.Name.ToLower().Contains(search.Name.Trim().ToLower()));

                    if (!string.IsNullOrEmpty(search.Code))
                        query = query.Where(x => x.Code.ToLower().Contains(search.Code.Trim().ToLower()));
                }

                query = query.OrderBy(x => x.Priority);
                return await PagedList<DM_DuLieuDanhMucDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message);
            }
        }

        public async Task<DM_DuLieuDanhMucDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new DM_DuLieuDanhMucDto
                                  {
                                      CreatedId = q.CreatedId,
                                      UpdatedId = q.UpdatedId,
                                      GroupId = q.GroupId,
                                      Name = q.Name,
                                      Code = q.Code,
                                      Note = q.Note,
                                      Priority = q.Priority,
                                      DonViId = q.DonViId,
                                      DuongDanFile = q.DuongDanFile,
                                      NoiDung = q.NoiDung,
                                      IsDeleted = q.IsDeleted,
                                      Id = q.Id,
                                      CreatedBy = q.CreatedBy,
                                      UpdatedBy = q.UpdatedBy,
                                      DeletedId = q.DeletedId,
                                      CreatedDate = q.CreatedDate,
                                      UpdatedDate = q.UpdatedDate,
                                      DeletedDate = q.DeletedDate,
                                  }).FirstOrDefaultAsync();

                return item ?? throw new Exception("Data not found for ID: " + id);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve DTO: " + ex.Message);
            }
        }

        public async Task<List<DropdownOption>> GetDropdownByGroupCode(string groupCode)
        {
            return await (from dulieu in GetQueryable()
                          join nhom in  _context.DM_NhomDanhMuc
                          on dulieu.GroupId equals nhom.Id
                          where nhom.GroupCode == groupCode
                          select new DropdownOption
                          {
                              Value = dulieu.Id.ToString(),
                              Label = dulieu.Name,

                          }).ToListAsync();
        }

        public async Task<List<DropdownOption>> GetDropdownCodeByGroupCode(string groupCode)
        {
            return await (from dulieu in GetQueryable()
                          join nhom in  _context.DM_NhomDanhMuc
                          on dulieu.GroupId equals nhom.Id
                          where nhom.GroupCode == groupCode
                          select new DropdownOption
                          {
                              Value = dulieu.Code,
                              Label = dulieu.Name
                          }).ToListAsync();
        }
        public async Task<List<DM_DuLieuDanhMucDto>> GetListDataByGroupCode(string groupCode)
        {
            try
            {
                var query = from q in GetQueryable()
                            join nhom in  _context.DM_NhomDanhMuc
                            on q.GroupId equals nhom.Id
                            where nhom.GroupCode == groupCode
                            select new DM_DuLieuDanhMucDto
                            {
                                GroupId = q.GroupId,
                                Name = q.Name,
                                Code = q.Code,
                                Note = q.Note,
                                Priority = q.Priority,
                                DonViId = q.DonViId,
                                DuongDanFile = q.DuongDanFile,
                                NoiDung = q.NoiDung,
                                Id = q.Id,
                            };
                var data = await query.OrderBy(x => x.Priority).ToListAsync();
                return new List<DM_DuLieuDanhMucDto>(data);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message);
            }
        }

        public List<DropdownOption> ListColumnName(string TableName)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var type = assembly.GetTypes().FirstOrDefault(t => t.Name == TableName);

            if (type == null)
                return new List<DropdownOption>();
            var listColumn = GetAllPropsName(type).ToList();

            return listColumn.Select(x => new DropdownOption
            {
                Value = x,
                Label = x
            }).ToList();
        }

        private IEnumerable<string> GetAllPropsName(Type type)
        {
            var props = type.GetProperties();
            foreach (var prop in props)
            {
                if (prop.PropertyType.GetInterface("IEntity`1") != null)
                {
                    var propsChild = GetAllPropsName(prop.PropertyType);
                    foreach (var propChild in propsChild)
                    {
                        yield return prop.Name + "." + propChild;
                    }
                }
                yield return prop.Name;
            }
        }
        public async Task<PagedList<DropdownOption>> GetDataSelectLazyByGroupCode(SelectDM_DuLieuLazyRequest searchModel)
        {
            var group = await  _context.DM_NhomDanhMuc.FirstOrDefaultAsync(x => x.GroupCode == searchModel.GroupCode);
            if (group == null)
            {
                return new PagedList<DropdownOption>(new List<DropdownOption>(), 1, 0, 0);
            }
            var query = GetQueryable().Where(x => x.GroupId == group.Id);
            if (!string.IsNullOrEmpty(searchModel.FilterName))
            {
                query = query.Where(x => x.Name.Contains(searchModel.FilterName));
            }
            var countTotal = await query.CountAsync();
            var data = await query
                .OrderBy(x => x.Name)
                .Skip((searchModel.pageIndex - 1) * searchModel.pageSize)
                .Take(searchModel.pageSize)
                .Select(x => new DropdownOption
                {
                    Value = x.Code.ToString(),
                    Label = x.Name
                })
                .ToListAsync();
            DropdownOption selectedItem = null;

            if (!string.IsNullOrEmpty(searchModel.Selected) && searchModel.pageIndex == 1)
            {
                selectedItem = await query.Where(x => x.Code == searchModel.Selected)
                    .Select(x => new DropdownOption
                    {
                        Value = x.Code,
                        Label = x.Name,
                    })
                    .FirstOrDefaultAsync();

                if (selectedItem != null && !data.Any(i => i.Value == selectedItem.Value))
                {
                    if (data.Count > 20)
                    {
                        data.RemoveAt(20);
                    }
                }
            }
            return new PagedList<DropdownOption>(
                data,
                searchModel.pageIndex,
                searchModel.pageSize,
                countTotal
            );
        }

    }
}