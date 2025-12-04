using N.Api.Dto;
using N.Model.Entities;
using N.Service.Common;
using N.Service.Core.Mapper;
using N.Service.DM_DuLieuDanhMucService;
using N.Service.DM_DuLieuDanhMucService.Dto;
using N.Service.DM_DuLieuDanhMucService.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace N.Controllers
{
    [Route("api/[controller]")]
    public class DM_DuLieuDanhMucController : HinetController
    {
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;

        private readonly IMapper _mapper;
        private readonly ILogger<DM_DuLieuDanhMucController> _logger;

        public DM_DuLieuDanhMucController(
            IDM_DuLieuDanhMucService dM_DuLieuDanhMucService,
            IMapper mapper,
            ILogger<DM_DuLieuDanhMucController> logger
            )
        {
            this._dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<DM_DuLieuDanhMuc>> Create([FromBody] DM_DuLieuDanhMucRequest model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    if (_dM_DuLieuDanhMucService.GetQueryable().Where(x => x.Code.Equals(model.Code) && x.GroupId == model.GroupId).Any())
                    {
                        return DataResponse<DM_DuLieuDanhMuc>.False("Mã danh mục đã tồn tại!");
                    }

                    var entity = _mapper.Map<DM_DuLieuDanhMucRequest, DM_DuLieuDanhMuc>(model);
                    await _dM_DuLieuDanhMucService.CreateAsync(entity);

                 

                    return new DataResponse<DM_DuLieuDanhMuc>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<DM_DuLieuDanhMuc>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<DM_DuLieuDanhMuc>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPut("Update")]
        public async Task<DataResponse<DM_DuLieuDanhMuc>> Update([FromBody] DM_DuLieuDanhMucRequest model)
        {
            try
            {
                var entity = await _dM_DuLieuDanhMucService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<DM_DuLieuDanhMuc>.False("Không tìm thấy danh mục để sửa!");

                if (_dM_DuLieuDanhMucService.GetQueryable().Where(x => x.Code.Equals(model.Code) && x.Id != model.Id).Any())
                {
                    return DataResponse<DM_DuLieuDanhMuc>.False("Mã danh mục đã tồn tại!");
                }

                entity = _mapper.Map(model, entity);

           

                await _dM_DuLieuDanhMucService.UpdateAsync(entity);
                return new DataResponse<DM_DuLieuDanhMuc>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                return DataResponse<DM_DuLieuDanhMuc>.False(ex.Message);
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<DM_DuLieuDanhMucDto>> Get(Guid id)
        {
            var result = await _dM_DuLieuDanhMucService.GetDto(id);

            return new DataResponse<DM_DuLieuDanhMucDto>
            {
                Data = result,
                Message = "Get DM_DuLieuDanhMucDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<DM_DuLieuDanhMucDto>>> GetData([FromBody] DM_DuLieuDanhMucSearch search)
        {
            var result = await _dM_DuLieuDanhMucService.GetData(search);
            return new DataResponse<PagedList<DM_DuLieuDanhMucDto>>
            {
                Data = result,
                Message = "GetData PagedList<DM_DuLieuDanhMucDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _dM_DuLieuDanhMucService.GetByIdAsync(id);
                await _dM_DuLieuDanhMucService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("GetDropdown/{GroupCode}")]
        public async Task<DataResponse> GetDropdown(string GroupCode)
        {
            var result = new DataResponse();
            try
            {
                result.Data = await _dM_DuLieuDanhMucService.GetDropdownByGroupCode(GroupCode);
                result.Status = true;
                result.Message = "Lấy dropdown danh mục thành công";
            }
            catch (Exception)
            {
                result.Data = null;
                result.Status = false;
                result.Message = "Lấy danh mục không thành công!";
            }
            return result;
        }

        [HttpGet("GetDropdownCode/{GroupCode}")]
        public async Task<DataResponse> GetDropdownCode(string GroupCode)
        {
            var result = new DataResponse();
            try
            {
                result.Data = await _dM_DuLieuDanhMucService.GetDropdownCodeByGroupCode(GroupCode);
                result.Status = true;
                result.Message = "Lấy dropdown danh mục thành công";
            }
            catch (Exception)
            {
                result.Data = null;
                result.Status = false;
                result.Message = "Lấy danh mục không thành công!";
            }
            return result;
        }

        [HttpGet("GetListDataByGroupCode/{GroupCode}")]
        public async Task<DataResponse<List<DM_DuLieuDanhMucDto>>> GetListDataByGroupCode(string GroupCode)
        {
            var result = await _dM_DuLieuDanhMucService.GetListDataByGroupCode(GroupCode);
            return new DataResponse<List<DM_DuLieuDanhMucDto>>
            {
                Data = result,
                Message = "GetData List<DM_DuLieuDanhMucDto> thành công",
                Status = true
            };
        }
  

        [HttpGet("GetAllByGroupCode/{GroupCode}")]
        [AllowAnonymous]
        public async Task<DataResponse<List<DM_DuLieuDanhMucDto>>> GetAllByGroupCode(string GroupCode)
        {
            var result = await _dM_DuLieuDanhMucService.GetListDataByGroupCode(GroupCode);
            return new DataResponse<List<DM_DuLieuDanhMucDto>>
            {
                Data = result,
                Message = "GetData List<DM_DuLieuDanhMucDto> thành công",
                Status = true
            };
        }
    }
}