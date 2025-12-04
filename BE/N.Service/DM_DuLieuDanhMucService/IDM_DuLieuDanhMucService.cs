using N.Model.Entities;
using N.Service.DM_DuLieuDanhMucService.Dto;
using N.Service.Common;
using N.Service.Common.Service;
using N.Service.Dto;
using N.Service.DM_DuLieuDanhMucService.Request;

namespace N.Service.DM_DuLieuDanhMucService
{
    public interface IDM_DuLieuDanhMucService : IService<DM_DuLieuDanhMuc>
    {
        Task<PagedList<DM_DuLieuDanhMucDto>> GetData(DM_DuLieuDanhMucSearch search);

        Task<DM_DuLieuDanhMucDto> GetDto(Guid id);

        Task<List<DropdownOption>> GetDropdownByGroupCode(string groupCode);

        Task<List<DropdownOption>> GetDropdownCodeByGroupCode(string groupCode);
        Task<List<DM_DuLieuDanhMucDto>> GetListDataByGroupCode(string groupCode);
        List<DropdownOption> ListColumnName(string TableName);
        Task<FileSetting> GetObjectSettting();
        Task<List<DM_DuLieuDanhMucDto>> GetByGroupCode(string groupCode);
    }
}