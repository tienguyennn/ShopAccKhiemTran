using N.Api.Dto;
using N.Model.Entities;
using N.Service.AccountService;
using N.Service.AccountService.Dto;
using N.Service.Common;
using N.Service.Core.Mapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace N.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : HinetController
    {
        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;
        private readonly ILogger<AccountController> _logger;

        public AccountController(
            IAccountService accountService,
            IMapper mapper,
            ILogger<AccountController> logger)
        {
            _accountService = accountService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        [Authorize]
        public async Task<DataResponse<AccountDto>> Create([FromBody] AccountCreateUpdateDto model)
        {
            try
            {
                var account = _mapper.Map<Account>(model);
                account.SellerId = UserId;
                account.Status = "Available";

                await _accountService.CreateAsync(account);

                var dto = _mapper.Map<AccountDto>(account);
                return new DataResponse<AccountDto>
                {
                    Data = dto,
                    Message = "Tạo tài khoản thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return DataResponse<AccountDto>.False("Lỗi tạo tài khoản", new[] { ex.Message });
            }
        }

        [HttpPut("Update/{id}")]
        [Authorize]
        public async Task<DataResponse<AccountDto>> Update(Guid id, [FromBody] AccountCreateUpdateDto model)
        {
            try
            {
                var account = await _accountService.GetByIdAsync(id);
                if (account == null)
                    return DataResponse<AccountDto>.False("Không tìm thấy tài khoản");

                account = _mapper.Map(model, account);
                await _accountService.UpdateAsync(account);

                var dto = _mapper.Map<AccountDto>(account);
                return new DataResponse<AccountDto>
                {
                    Data = dto,
                    Message = "Cập nhật tài khoản thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return DataResponse<AccountDto>.False("Lỗi cập nhật tài khoản", new[] { ex.Message });
            }
        }

        [HttpGet("Get/{id}")]
        [AllowAnonymous]
        public async Task<DataResponse<AccountDto>> Get(Guid id)
        {
            try
            {
                var account = await _accountService.GetDto(id);
                if (account == null)
                    return DataResponse<AccountDto>.False("Không tìm thấy tài khoản");

                return new DataResponse<AccountDto>
                {
                    Data = account,
                    Message = "Lấy chi tiết tài khoản thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return DataResponse<AccountDto>.False("Lỗi lấy tài khoản", new[] { ex.Message });
            }
        }

        [HttpPost("GetData")]
        [AllowAnonymous]
        public async Task<DataResponse<PagedList<AccountDto>>> GetData([FromBody] AccountSearchDto search)
        {
            try
            {
                var result = await _accountService.GetData(search);
                return new DataResponse<PagedList<AccountDto>>
                {
                    Data = result,
                    Message = "Lấy danh sách tài khoản thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return DataResponse<PagedList<AccountDto>>.False("Lỗi lấy danh sách", new[] { ex.Message });
            }
        }

        [HttpDelete("Delete/{id}")]
        [Authorize]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var account = await _accountService.GetByIdAsync(id);
                if (account == null)
                    return DataResponse.False("Không tìm thấy tài khoản");

                await _accountService.DeleteAsync(account);
                return DataResponse.Success("Xóa tài khoản thành công");
            }
            catch (Exception ex)
            {
                return DataResponse.False("Lỗi xóa tài khoản: " + ex.Message);
            }
        }

        [HttpPut("Publish/{id}")]
        [Authorize]
        public async Task<DataResponse<AccountDto>> Publish(Guid id, [FromBody] bool isPublish)
        {
            try
            {
                var account = await _accountService.GetByIdAsync(id);
                if (account == null)
                    return DataResponse<AccountDto>.False("Không tìm thấy tài khoản");

                account.IsPublished = isPublish;
                await _accountService.UpdateAsync(account);

                var dto = _mapper.Map<AccountDto>(account);
                return new DataResponse<AccountDto>
                {
                    Data = dto,
                    Message = "Cập nhật trạng thái thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return DataResponse<AccountDto>.False("Lỗi cập nhật trạng thái", new[] { ex.Message });
            }
        }

        [HttpGet("GetByGameType/{gameType}")]
        [AllowAnonymous]
        public async Task<DataResponse<List<AccountDto>>> GetByGameType(string gameType)
        {
            try
            {
                var accounts = await _accountService.GetByGameType(gameType);
                return new DataResponse<List<AccountDto>>
                {
                    Data = accounts,
                    Message = "Lấy tài khoản theo loại game thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return DataResponse<List<AccountDto>>.False("Lỗi lấy tài khoản", new[] { ex.Message });
            }
        }

        [HttpGet("GetPublished")]
        [AllowAnonymous]
        public async Task<DataResponse<List<AccountDto>>> GetPublished()
        {
            try
            {
                var accounts = await _accountService.GetPublishedAccounts();
                return new DataResponse<List<AccountDto>>
                {
                    Data = accounts,
                    Message = "Lấy tài khoản công khai thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return DataResponse<List<AccountDto>>.False("Lỗi lấy tài khoản", new[] { ex.Message });
            }
        }
    }
}
