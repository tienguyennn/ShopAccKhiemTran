using N.Model.Entities;
using N.Service.DM_NhomDanhMucService.Dto;
using N.Service.Common;
using N.Service.Common.Service;
using N.Service.DM_NhomDanhMucService.Request;

namespace N.Service.DM_NhomDanhMucService
{
    public interface IDM_NhomDanhMucService : IService<DM_NhomDanhMuc>
    {
        Task<PagedList<DM_NhomDanhMucDto>> GetData(DM_NhomDanhMucSearch search);

        Task<DM_NhomDanhMucDto> GetDto(Guid id);

        Task<List<DanhMucDto>> GetListDanhMuc();
    }
}