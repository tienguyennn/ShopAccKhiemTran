using N.Model;
using N.Model.Entities;
using N.Service.AccountService.Dto;
using N.Service.Common;
using N.Service.Core.Mapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace N.Service.AccountService
{
    public interface IAccountService : IService<Account>
    {
        Task<PagedList<AccountDto>> GetData(AccountSearchDto search);
        Task<AccountDto?> GetDto(Guid id);
        Task<List<AccountDto>> GetByGameType(string gameType);
        Task<List<AccountDto>> GetPublishedAccounts();
    }

    public class AccountService : Service<Account>, IAccountService
    {
        private readonly IMapper _mapper;

        public AccountService(AppDbContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }

        public async Task<PagedList<AccountDto>> GetData(AccountSearchDto search)
        {
            try
            {
                var query = GetQueryable().Where(x => !x.IsDeleted);

                if (!string.IsNullOrEmpty(search.GameType))
                {
                    query = query.Where(x => x.GameType == search.GameType);
                }

                if (!string.IsNullOrEmpty(search.Rank))
                {
                    query = query.Where(x => x.Rank.Contains(search.Rank));
                }

                if (!string.IsNullOrEmpty(search.Status))
                {
                    query = query.Where(x => x.Status == search.Status);
                }

                if (search.PriceFrom.HasValue)
                {
                    query = query.Where(x => x.Price >= search.PriceFrom.Value);
                }

                if (search.PriceTo.HasValue)
                {
                    query = query.Where(x => x.Price <= search.PriceTo.Value);
                }

                if (search.IsPublished.HasValue)
                {
                    query = query.Where(x => x.IsPublished == search.IsPublished.Value);
                }

                if (!string.IsNullOrEmpty(search.SearchText))
                {
                    query = query.Where(x => x.AccountCode.Contains(search.SearchText) || 
                                             x.Rank.Contains(search.SearchText) ||
                                             x.Description!.Contains(search.SearchText));
                }

                var totalCount = await query.CountAsync();
                var items = await query
                    .OrderByDescending(x => x.CreatedDate)
                    .Skip((search.PageIndex - 1) * search.PageSize)
                    .Take(search.PageSize)
                    .Select(x => _mapper.Map<AccountDto>(x))
                    .ToListAsync();

                return new PagedList<AccountDto>
                {
                    Items = items,
                    PageIndex = search.PageIndex,
                    PageSize = search.PageSize,
                    TotalCount = totalCount,
                    TotalPage = (totalCount + search.PageSize - 1) / search.PageSize
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<AccountDto?> GetDto(Guid id)
        {
            var account = await GetByIdAsync(id);
            return account != null ? _mapper.Map<AccountDto>(account) : null;
        }

        public async Task<List<AccountDto>> GetByGameType(string gameType)
        {
            var accounts = await GetQueryable()
                .Where(x => x.GameType == gameType && x.IsPublished && !x.IsDeleted)
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => _mapper.Map<AccountDto>(x))
                .ToListAsync();

            return accounts;
        }

        public async Task<List<AccountDto>> GetPublishedAccounts()
        {
            var accounts = await GetQueryable()
                .Where(x => x.IsPublished && !x.IsDeleted)
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => _mapper.Map<AccountDto>(x))
                .ToListAsync();

            return accounts;
        }
    }
}
