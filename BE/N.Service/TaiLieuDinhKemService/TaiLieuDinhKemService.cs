using N.Model.Entities;
using N.Service.Common.Service;
using N.Service.TaiLieuDinhKemService.Dto;
using N.Service.Common;
using Microsoft.EntityFrameworkCore;
using N.Service.Constant;
using N.Service.TaiLieuDinhKemService.Request;
using Newtonsoft.Json;
using N.Model;
using N.Extensions;

namespace N.Service.TaiLieuDinhKemService
{
    public class TaiLieuDinhKemService : Service<TaiLieuDinhKem>, ITaiLieuDinhKemService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public TaiLieuDinhKemService(AppDbContext context,
            IHttpClientFactory httpClientFactory

            ) : base(context)
        {
            this._httpClientFactory = httpClientFactory;

        }

        public async Task<List<TaiLieuDinhKem>> GetByItemAsync(Guid itemId)
        {
            return await GetQueryable().Where(x => x.ItemId == itemId).ToListAsync();
        }

        public Task<List<TaiLieuDinhKem>> GetByIdsAsync(List<Guid> ids)
        {
            return GetQueryable().Where(x => ids.Contains(x.Id)).ToListAsync();
        }


        public async Task<TaiLieuDinhKem> UpdateItemIdAsync(Guid itemId, Guid id)
        {
            var item = await GetByIdAsync(id);
            if (item != null)
            {
                item.ItemId = itemId;
                await UpdateAsync(item);
            }
            return item;
        }

        public async Task<List<TaiLieuDinhKem>> UpdateItemIdAsync(Guid itemId, List<Guid> ids)
        {
            var items = await GetByIdsAsync(ids);
            foreach (var item in items)
            {
                item.ItemId = itemId;
            }
            await UpdateAsync(items);
            return items;
        }

        public async Task<PagedList<TaiLieuDinhKemDto>> GetData(TaiLieuDinhKemSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new TaiLieuDinhKemDto
                            {
                                ItemId = q.ItemId,
                                UserId = q.UserId,
                                KichThuoc = q.KichThuoc,
                                TenTaiLieu = q.TenTaiLieu,
                                ItemType = q.ItemType,
                                Path = q.Path,
                                PdfPath = q.PdfPath,
                                Extension = q.Extension,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                Id = q.Id,
                                isXoaFile = q.IsDeleted,

                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.ItemId))
                    {
                        query = query.Where(x => x.ItemId == search.ItemId.ToGuid());
                    }
                    if (!string.IsNullOrEmpty(search.TenTaiLieu))
                    {
                        query = query.Where(x => x.TenTaiLieu.ToUpper().Contains(search.TenTaiLieu.Trim().ToUpper()));
                    }

                    if (!string.IsNullOrEmpty(search.DinhDangFile))
                    {
                        query = query.Where(x => x.Extension.ToUpper().Equals(search.DinhDangFile.Trim().ToUpper()));
                    }

                    if (search.KichThuocMin != null)
                    {
                        query = query.Where(x => x.KichThuoc != null && x.KichThuoc >= search.KichThuocMin);
                    }

                    if (search.KichThuocMax != null)
                    {
                        query = query.Where(x => x.KichThuoc != null && x.KichThuoc <= search.KichThuocMax);
                    }

                    if (!string.IsNullOrEmpty(search.LoaiTaiLieu))
                    {
                        query = query.Where(x => x.ItemType != null && x.ItemType.ToUpper().Equals(search.LoaiTaiLieu.Trim().ToUpper()));
                    }


                    if (search.IsDonVi.HasValue && search.IsDonVi.Value)
                    {
                        query = query.Where(x => x.ItemType != null &&
                            x.ItemType.ToLower().Equals(LoaiTaiLieuConstant.TaiLieuDonVi) &&
                            x.ItemId != null &&
                            x.ItemId.ToString().ToUpper().Equals(search.ItemId.Trim().ToUpper()));
                    }
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<TaiLieuDinhKemDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message, ex);
            }

        }



        public async Task<string> GetPathFromId(Guid id)
        {
            var entity = await GetQueryable().FirstOrDefaultAsync(x => x.Id == id);
            return entity?.Path ?? throw new Exception("Attachment not found");
        }


        public async Task<Stream?> GetStreamAsync(Guid? fileId)
        {
            var client = _httpClientFactory.CreateClient("FileServerClient");

            var response = await client.GetAsync($"/fileserver/{fileId}", HttpCompletionOption.ResponseHeadersRead);

            return await response.Content.ReadAsStreamAsync();
        }

        public async Task<Guid> UploadAsync(Stream fileStream, string? fileName, string? fileType, Guid? itemId)
        {
            var client = _httpClientFactory.CreateClient("FileServerClient");

            using var form = new MultipartFormDataContent();

            fileStream.Position = 0; // Đảm bảo con trỏ ở đầu stream
            var fileContent = new StreamContent(fileStream);
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream"); // Hoặc loại file cụ thể nếu biết

            form.Add(fileContent, "Files", fileName);

            if (!string.IsNullOrEmpty(fileType))
            {
                form.Add(new StringContent(fileType), "FileType");
            }

            if (itemId.HasValue)
            {
                form.Add(new StringContent(itemId.Value.ToString()), "ItemId");
            }

            var response = await client.PostAsync("/api/fileserver/upload", form);

            try
            {
                var content = await response.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<DataResponseUpload>(content);
                if (data != null && data.Status && data.Data.Count > 0)
                {
                    return data.Data[0].Id;
                }
                else
                {
                    throw new Exception($"Upload thất bại: {data?.Message}");
                }
            }
            catch (Exception ex)
            {

                throw new Exception($"Upload thất bại: {ex.Message}");
            }
        }
        private class DataResponseUpload
        {
            public string? Message { get; set; }
            public List<TaiLieuDinhKem> Data { get; set; } = new List<TaiLieuDinhKem>();
            public bool Status { get; set; }

        }
    }
}