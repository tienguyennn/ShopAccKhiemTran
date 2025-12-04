using N.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using N.Model.Entities;
using N.Service.DM_NhomDanhMucService;
using N.Service.DM_NhomDanhMucService.Dto;
using N.Service.DM_NhomDanhMucService.Request;
using N.Service.Common;
using N.Api.Dto;

namespace N.Controllers
{
    [Route("api/[controller]")]
    public class DM_NhomDanhMucController : HinetController
    {
        private readonly IDM_NhomDanhMucService _dM_NhomDanhMucService;
        private readonly IMapper _mapper;
        private readonly ILogger<DM_NhomDanhMucController> _logger;

        public DM_NhomDanhMucController(
            IDM_NhomDanhMucService dM_NhomDanhMucService,
            IMapper mapper,
            ILogger<DM_NhomDanhMucController> logger
            )
        {
            this._dM_NhomDanhMucService = dM_NhomDanhMucService;
            this._mapper = mapper;
            _logger = logger;
        }


        [HttpPost("Create")]
        public async Task<DataResponse<DM_NhomDanhMuc>> Create([FromBody] DM_NhomDanhMucRequest model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // check trùng
                    if (_dM_NhomDanhMucService.GetQueryable().Where(x => x.GroupCode.Equals(model.GroupCode)).Any())
                    {
                        return DataResponse<DM_NhomDanhMuc>.False("Mã nhóm danh mục đã tồn tại!");
                    }

                    var entity = _mapper.Map<DM_NhomDanhMucRequest, DM_NhomDanhMuc>(model);
                    await _dM_NhomDanhMucService.CreateAsync(entity);
                    return new DataResponse<DM_NhomDanhMuc>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<DM_NhomDanhMuc>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<DM_NhomDanhMuc>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPut("Update")]
        public async Task<DataResponse<DM_NhomDanhMuc>> Update([FromBody] DM_NhomDanhMucRequest model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _dM_NhomDanhMucService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<DM_NhomDanhMuc>.False("Không tìm thấy nhóm danh mục để sửa");

                    // check trùng
                    if (_dM_NhomDanhMucService.GetQueryable().Where(x => x.GroupCode.Equals(model.GroupCode) && x.Id != model.Id).Any())
                    {
                        return DataResponse<DM_NhomDanhMuc>.False("Mã nhóm danh mục đã tồn tại!");
                    }

                    entity = _mapper.Map(model, entity);
                    await _dM_NhomDanhMucService.UpdateAsync(entity);
                    return new DataResponse<DM_NhomDanhMuc>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<DM_NhomDanhMuc>.False(ex.Message);
                }
            }
            return DataResponse<DM_NhomDanhMuc>.False("Some properties are not valid", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<DM_NhomDanhMucDto>> Get(Guid id)
        {
            var result = await _dM_NhomDanhMucService.GetDto(id);
            return new DataResponse<DM_NhomDanhMucDto>
            {
                Data = result,
                Message = "Get DM_NhomDanhMucDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<DM_NhomDanhMucDto>>> GetData([FromBody] DM_NhomDanhMucSearch search)
        {
            var result = await _dM_NhomDanhMucService.GetData(search);
            return new DataResponse<PagedList<DM_NhomDanhMucDto>>
            {
                Data = result,
                Message = "GetData PagedList<DM_NhomDanhMucDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _dM_NhomDanhMucService.GetByIdAsync(id);
                await _dM_NhomDanhMucService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpGet("GetDanhSachDanhMuc")]
        public async Task<DataResponse<List<DanhMucDto>>> GetDanhSachDanhMuc()
        {
            var result = await _dM_NhomDanhMucService.GetListDanhMuc();
            return new DataResponse<List<DanhMucDto>>
            {
                Data = result,
                Message = "GetDanhSachDanhMuc List<DanhMucDto> thành công",
                Status = true
            };
        }

      
    }
}