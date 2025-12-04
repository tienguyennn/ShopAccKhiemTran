using N.Api.Dto;
using N.Model.Entities;
using N.Service.Common;
using N.Service.Constant;
using N.Service.Core.Mapper;
using N.Service.DepartmentService;
using N.Service.DepartmentService.Dto;
using N.Service.DepartmentService.Request;
using N.Service.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace N.Controllers
{
    [Route("api/[controller]")]
    public class DepartmentController : HinetController
    {
        private readonly IDepartmentService _departmentService;
        private readonly IMapper _mapper;
        private readonly ILogger<DepartmentController> _logger;

        public DepartmentController(
            IDepartmentService departmentService,
            IMapper mapper,
            ILogger<DepartmentController> logger
            )
        {
            this._departmentService = departmentService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("SaveDepartmentChanges")]
        public async Task<DataResponse<List<Department>>> SaveDepartmentChanges(List<DepartmentSaveRequest> departments)
        {
            var exitingIds = new List<Guid>();
            try
            {
                if (departments != null && departments.Any())
                {
                    foreach (var dept in departments)
                    {
                        var currentDept = await _departmentService.GetByIdAsync(dept.Id);
                        if (currentDept == null)
                        {
                            var item = _mapper.Map<DepartmentSaveRequest, Department>(dept);
                            await _departmentService.CreateAsync(item);
                            exitingIds.Add(dept.Id ?? Guid.Empty);
                        }
                        else
                        {
                            currentDept.Name = dept.Name;
                            currentDept.Code = dept.Code;
                            currentDept.ShortName = dept.ShortName;
                            currentDept.DiaDanh = dept.DiaDanh;
                            currentDept.ParentId = dept.ParentId;
                            currentDept.Priority = dept.Priority;
                            currentDept.Level = dept.Level;
                            currentDept.Loai = dept.Loai;
                            currentDept.IsActive = dept.IsActive;
                            await _departmentService.UpdateAsync(currentDept);
                            exitingIds.Add(currentDept.Id);
                        }
                    }
                }

                var removeDepts = _departmentService.GetQueryable().Where(x => !exitingIds.Contains(x.Id));
                if (removeDepts.Any())
                {
                    await _departmentService.DeleteAsync(removeDepts);
                }
                var response = new DataResponse<List<Department>> { Data = _mapper.Map<List<DepartmentSaveRequest>, List<Department>>(departments), Status = true };
                return response;
            }
            catch (Exception ex)
            {
                var response = new DataResponse<List<Department>> { Data = null, Status = false, Message = ex.Message };
                return response;
            }
        }

        [HttpPost("Create")]
        public async Task<DataResponse<Department>> Create([FromBody] DepartmentRequest model)
        {
            var entity = _mapper.Map<DepartmentRequest, Department>(model);
            await _departmentService.CreateAsync(entity);
            return new DataResponse<Department>() { Data = entity, Status = true };
        }

        [HttpPut("Update")]
        public async Task<DataResponse<Department>> Update([FromBody] DepartmentRequest model)
        {
            var entity = await _departmentService.GetByIdAsync(model.Id);
            if (entity == null)
                return DataResponse<Department>.False("Department not found");

            entity = _mapper.Map(model, entity);
            await _departmentService.UpdateAsync(entity);
            return new DataResponse<Department>() { Data = entity, Status = true };
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<DepartmentDto>> Get(Guid id)
        {
            var data = await _departmentService.GetDto(id);
            return new DataResponse<DepartmentDto> { Data = data, Status = true };
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<DepartmentDto>>> GetData([FromBody] DepartmentSearch search)
        {
            var data = await _departmentService.GetData(search);
            return new DataResponse<PagedList<DepartmentDto>> { Data = data, Status = true };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            var entity = await _departmentService.GetByIdAsync(id);
            await _departmentService.DeleteAsync(entity);
            return DataResponse.Success(null);
        }

        [HttpPut("deactive/{id}")]
        public async Task<DataResponse> Deactive(Guid id)
        {
            var entity = await _departmentService.GetByIdAsync(id);
            entity.IsActive = !entity.IsActive;
            await _departmentService.UpdateAsync(entity);
            return DataResponse.Success(entity);
        }

        [HttpGet("GetDepartmentsWithHierarchy")]
        public async Task<DataResponse<List<DepartmentHierarchy>>> GetDepartmentsWithHierarchy()
        {
            var data = _departmentService.GetDepartmentHierarchy();
            return new DataResponse<List<DepartmentHierarchy>> { Data = data, Status = true };
        }

        [HttpPost("GetDropDepartment")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropDepartment(string? selected)
        {
            var result = await _departmentService.GetDropDown(selected);

            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropDepartment thành công",
                Status = true
            };
        }

        [HttpPost("GetDropRolesInDepartment")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropRolesInDepartment(Guid? departmentId, Guid? userId)
        {
            //var deparment = _departmentService.GetQueryable().Where(x => x.Code == departmentCode).FirstOrDefault();
            if (departmentId == null)
            {
                return DataResponse<List<DropdownOption>>.False("Vui lÃ²ng chá»n phÃ²ng ban");
            }

            var result = await _departmentService.GetDropRolesInDepartment(departmentId, userId);

            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropRolesInDepartment thành công",
                Status = true
            };
        }


        [HttpGet("GetHierarchicalDropdownList")]
        public async Task<DataResponse<List<DropdownOptionTree>>> GetHierarchicalDropdownList(bool disabledParent = true)
        {
            var response = await _departmentService.GetDropdownTreeOption(disabledParent);
            return DataResponse<List<DropdownOptionTree>>.Success(response, "Lấy dữ liệu thành công");
        }

        [HttpGet("GetDropdownListByUserDepartment")]
        public async Task<DataResponse<List<DropdownOptionTree>>> GetDropdownListByUserDepartment(bool disabledParent = true)
        {
            var donViId = HasRole(RoleConstant.Admin) ? null : DonViId;
            var response = await _departmentService.GetDropdownTreeOptionByUserDepartment(disabledParent, donViId);
            return DataResponse<List<DropdownOptionTree>>.Success(response, "Lấy dữ liệu thành công");
        }



        [HttpGet("GetSubAndCurrentUnitDropdown")]
        public async Task<DataResponse<List<DropdownOptionTree>>> GetSubAndCurrentUnitDropdown(bool disabledParent = true)
        {
            var response = await _departmentService.GetSubAndCurrentUnitDropdownTreeByUserDepartment(disabledParent, DonViId);
            return DataResponse<List<DropdownOptionTree>>.Success(response, "Lấy dữ liệu thành công");
        }
    }
}