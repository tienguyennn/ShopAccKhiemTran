using N.Model.Entities;
using N.Service.TaiLieuDinhKemService.Dto;
using N.Service.Common;
using N.Service.Common.Service;
using N.Service.TaiLieuDinhKemService.Request;

namespace N.Service.TaiLieuDinhKemService
{
    public interface ITaiLieuDinhKemService : IService<TaiLieuDinhKem>
    {
        Task<List<TaiLieuDinhKem>> GetByItemAsync(Guid itemId);
        Task<PagedList<TaiLieuDinhKemDto>> GetData(TaiLieuDinhKemSearch search);

        Task<List<TaiLieuDinhKem>> GetByIdsAsync(List<Guid> ids);
        Task<TaiLieuDinhKem> UpdateItemIdAsync(Guid itemId, Guid id);
        Task<List<TaiLieuDinhKem>> UpdateItemIdAsync(Guid itemId, List<Guid> ids);
        Task<string> GetPathFromId(Guid id);
        Task<Stream?> GetStreamAsync(Guid? fileId);
        Task<Guid> UploadAsync(Stream fileStream, string? fileName, string? fileType, Guid? itemId);


    }
}